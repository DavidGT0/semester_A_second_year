
document.addEventListener('DOMContentLoaded', loadUsers);

async function loadUsers() {
    try {
        let response = await fetch('/users');
        if (response.status === 401) {
            window.location.href = '/login';
            return;
        }

        // בדיקה שהתשובה תקינה
        if (!response.ok) {
            let errorData = await response.json();
            alert('שגיאה: ' + (errorData.message || 'שגיאה לא ידועה'));
            return;
        }

        let data = await response.json();

        // בדיקה שהנתונים הם מערך
        if (!Array.isArray(data)) {
            console.error('Data received:', data);
            alert('התקבלו נתונים לא תקינים מהשרת');
            return;
        }

        displayUsers(data);
    } catch (err) {
        console.error('Error loading users:', err);
        alert('שגיאה בטעינת משתמשים: ' + err.message);
    }
}

function displayUsers(users) {
    let tableBody = document.getElementById('usersTable');
    tableBody.innerHTML = '';

    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">אין משתמשים להצגה</td></tr>';
        return;
    }

    users.forEach(user => {
        // הגנה מפני שמות עם גרשיים
        let safeName = (user.name || '').replace(/'/g, "\\'");
        let safeUserName = (user.userName || '').replace(/'/g, "\\'");

        let row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.userName}</td>
                <td>
                    <button onclick="editUser(${user.id}, '${safeName}', '${safeUserName}')">ערוך</button>
                    <button onclick="deleteUser(${user.id})">מחק</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function editUser(id, name, userName) {
    document.getElementById('id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('userName').value = userName;
    document.getElementById('pass').value = '';
}

function clearForm() {
    document.getElementById('id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('userName').value = '';
    document.getElementById('pass').value = '';
}

async function addOrEditUser() {
    let id = document.getElementById('id').value;
    let name = document.getElementById('name').value;
    let userName = document.getElementById('userName').value;
    let pass = document.getElementById('pass').value;

    if (!name || !userName) {
        alert('נא למלא שם ושם משתמש');
        return;
    }

    try {
        if (id) {
            // עדכון משתמש
            let body = { name, userName };
            if (pass) body.pass = pass;

            let response = await fetch(`/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            let data = await response.json();
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
    if (!confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
        return;
    }

    try {
        let response = await fetch(`/users/${id}`, {
            method: 'DELETE'
        });
        let data = await response.json();
        alert(data.message);
        loadUsers();
    } catch (err) {
        console.error('Error deleting user:', err);
        alert('שגיאה במחיקה: ' + err.message);
    }
}