let greating = "Hello ";
greating += localStorage.getItem('name');
document.getElementById('greating').innerHTML = greating;
let allCategories = {};
let allTasks = [];

async function getTasks() {
    try {
        let response = await fetch('/tasks');
        if (response.status == 401) {
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            let errorData = await response.json();
            console.error('Error fetching tasks:', errorData);
            return;
        }

        let data = await response.json();

        if (!Array.isArray(data)) {
            console.error('Tasks data is not an array:', data);
            allTasks = [];
        } else {
            allTasks = data;
        }

        createTable(allTasks);
    } catch (err) {
        console.error('getTasks error:', err);
    }
}

async function getCategories() {
    try {
        let response = await fetch('/categories');
        if (response.status == 401) {
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            let errorData = await response.json();
            console.error('Error fetching categories:', errorData);
            return;
        }

        let data = await response.json();

        if (!Array.isArray(data)) {
            console.error('Categories data is not an array:', data);
            data = [];
        }

        allCategories = {};
        for (let c of data) {
            allCategories[c.id] = c;
        }

        createFilterSelect(data);
        createTaskCategorySelect(data);
    } catch (err) {
        console.error('getCategories error:', err);
    }
}

function createTable(data) {
    if (!Array.isArray(data)) {
        document.getElementById('myTable').innerHTML = '<tr><td colspan="5">No tasks found</td></tr>';
        return;
    }

    let txt = "";
    for (let obj of data) {
        if (obj) {
            let isChecked = obj.is_done ? "checked" : "";
            let rowClass = obj.is_done ? "class='rowClass'" : "";
            let catName = (obj.category_id && allCategories[obj.category_id]) ? allCategories[obj.category_id].name : '--';

            txt += `<tr ${rowClass}>`;
            txt += `<td><input type="checkbox" ${isChecked} onchange="taskDone(${obj.id},this)"></td>`;
            txt += `<td>${obj.text}</td>`;
            txt += `<td>${catName}</td>`;
            txt += `<td><button onclick="deleteTask(${obj.id})">🗑️</button></td>`;
            txt += `<td><button onclick="taskToEdit(${obj.id})">✏️</button></td>`;
            txt += "</tr>";
        }
    }
    document.getElementById('myTable').innerHTML = txt;
}

function createFilterSelect(data) {
    let txt = `<option value="0">All</option>`;
    for (let obj of data) {
        if (obj) {
            txt += `<option value="${obj.id}">${obj.name}</option>`;
        }
    }
    let elm = document.getElementById('filterSelect');
    if(elm) elm.innerHTML = txt;
}

function createTaskCategorySelect(data) {
    let txt = `<option value="">No Category</option>`;
    for (let obj of data) {
        if (obj) {
            txt += `<option value="${obj.id}">${obj.name}</option>`;
        }
    }
    let elm = document.getElementById('categorySelect');
    if(elm) elm.innerHTML = txt;
}

function sortTable() {
    let elm = document.getElementById('filterSelect');
    let val = elm ? elm.value : 0;

    if (val == 0) {
        createTable(allTasks);
    } else {
        let sorted = allTasks.filter(task => task.category_id == val);
        createTable(sorted);
    }
}

async function taskDone(id, elm) {
    let isDone = elm.checked;
    try {
        let response = await fetch(`/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDone })
        })
        if(!response.ok) {
            alert("שגיאה בעדכון משימה");
            getTasks();
        } else {
            getTasks();
        }
    } catch (err) {
        alert(err)
    }
}

async function taskToEdit(id) {
    try {
        let response = await fetch(`/tasks/${id}`);
        let data = await response.json();
        if(!response.ok){
            alert(data.message);
        }else{
            document.getElementById('id').value = data.id;
            document.getElementById('text').value = data.text;
            let catSelect = document.getElementById('categorySelect');
            if(catSelect && data.category_id) catSelect.value = data.category_id;
        }
    } catch (err) {
        alert(err)
    }
}

async function editTask(id) {
    try {
        let text = document.getElementById('text').value;
        let response = await fetch(`/tasks/${id}`,{
            method:'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({newTask: {text}})
        })

        if(!response.ok) {
            let errorData = await response.json();
            alert("שגיאה בעריכה: " + (errorData.message || "Unknown error"));
        } else {
            getTasks();
            document.getElementById('text').value = "";
            document.getElementById('id').value = "";
            let catSelect = document.getElementById('categorySelect');
            if(catSelect) catSelect.value = "";
        }
    } catch (err) {
        alert(err)
    }
}

function addOrEdit(){
    let id = document.getElementById('id').value;
    if(id){
        editTask(id);
    }else{
        addTask();
    }
}

async function addTask() {
    try {
        let text = document.getElementById('text').value;
        if (!text) {
            alert("נא למלא טקסט");
            return;
        }

        let catSelect = document.getElementById('categorySelect');
        let catId = catSelect ? catSelect.value : null;

        if(catId === "" || catId === "null") {
            catId = null;
        } else {
            catId = parseInt(catId);
        }

        let response = await fetch('/tasks',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text,catId})
        })

        if(!response.ok) {
            let errorData = await response.json();
            alert("שגיאה בהוספה: " + (errorData.message || "Unknown error"));
        } else {
            getTasks();
            document.getElementById('text').value = "";
            if(catSelect) catSelect.value = "";
        }
    } catch (err) {
        alert(err)
    }
}

async function deleteTask(id) {
    try {
        let response = await fetch(`/tasks/${id}`,{
            method:'DELETE'
        })

        if(!response.ok){
            let data = await response.json();
            alert(data.message);
        } else {
            getTasks();
        }
    } catch (err) {
        alert(err)
    }
}

async function logout() {
    try {
        await fetch('/auth/logout');
        localStorage.removeItem('name');
        window.location.href = '/login';
    } catch (err) {
        console.error('Logout error:', err);
    }
}

getCategories();
getTasks();