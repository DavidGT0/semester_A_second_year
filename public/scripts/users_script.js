document.addEventListener('DOMContentLoaded', loadUsers);

async function loadUsers() {
    try {
        let response = await fetch('/users');
        if (response.status === 401) {
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            let errorData = await response.json();
            alert('שגיאה: ' + (errorData.message || 'שגיאה לא ידועה'));
            return;
        }

        let data = await response.json();

        if (!Array.isArray(data)) {
            console.error('Data received:', data);
            alert('התקבלו נתונים לא תקינים מהשרת');
            return;
        }

        displayUsers(data);
    } catch (err) {
        console.error('Error loading users:', err);
    }
}

function displayUsers(users) {
    let tableBody = document.getElementById('usersTable');
    tableBody.innerHTML = '';

    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">אין משתמשים להצגה</td></tr>';
        return;
    }

    users.forEach(user => {
        let safeName = (user.name || '').replace(/'/g, "\\'");
        let safeUserName = (user.userName || '').replace(/'/g, "\\'");
        let safeEmail = (user.email || '').replace(/'/g, "\\'");

        let row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.userName}</td>
                <td>
                    <button onclick="editUser(${user.id}, '${safeName}', '${safeUserName}', '${safeEmail}')">ערוך</button>
                    <button onclick="deleteUser(${user.id})">מחק</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function editUser(id, name, userName, email) {
    document.getElementById('id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('userName').value = userName;
    document.getElementById('email').value = email;
    document.getElementById('pass').value = '';
    document.getElementById('pass').placeholder = 'השאר ריק אם אין שינוי';
}

function clearForm() {
    document.getElementById('id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('pass').value = '';
    document.getElementById('pass').placeholder = 'חובה למשתמש חדש';
}

async function addOrEditUser() {
    let id = document.getElementById('id').value;
    let name = document.getElementById('name').value;
    let userName = document.getElementById('userName').value;
    let email = document.getElementById('email').value;
    let pass = document.getElementById('pass').value;

    if (!name || !userName || !email) {
        alert('נא למלא שם, אימייל ושם משתמש');
        return;
    }

    try {
        if (id) {
            // --- עריכת משתמש קיים ---
            let body = { name, userName, email };
            if (pass) body.pass = pass;

            let response = await fetch(`/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            let data = await response.json();
            if (!response.ok) throw new Error(data.message);
            alert(data.message);
        } else {
            // --- הוספת משתמש חדש (דרך הרשמה) ---
            if (!pass) {
                alert('חובה למלא סיסמה למשתמש חדש');
                return;
            }

            let response = await fetch('/auth/reg', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, userName, pass })
            });
            let data = await response.json();
            if (!response.ok) throw new Error(data.message);
            alert(data.message);
        }

        clearForm();
        loadUsers();
    } catch (err) {
        console.error('Error saving user:', err);
        alert('שגיאה: ' + err.message);
    }
}

async function deleteUser(id) {
    if (!confirm('האם אתה בטוח שברצונך למחוק משתמש זה? פעולה זו תמחק גם את כל המשימות והקטגוריות שלו!')) {
        return;
    }

    try {
        let response = await fetch(`/users/${id}`, {
            method: 'DELETE'
        });
        let data = await response.json();
        if (!response.ok) throw new Error(data.message);

        alert(data.message);
        loadUsers();
    } catch (err) {
        console.error('Error deleting user:', err);
        alert('שגיאה במחיקה: ' + err.message);
    }
}