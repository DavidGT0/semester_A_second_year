let greating = "Hello ";
greating += localStorage.getItem('name');
document.getElementById('greating').innerHTML = greating;
allCategories = [];

async function getTasks() {
    try {
        let response = await fetch('/tasks');
        if (response.status == 401) {
            window.location.href = '/login';
            return;
        }
        let data = await response.json();
        if (response.status == 400) {
            alert(data.message);
            return;
        }
        createTable(data);
    } catch (err) {
        alert(err)
    }
}

async function getCategories() {
    try {
        let response = await fetch('/categories');
        if (response.status == 401) {
            window.location.href = '/login';
            return;
        }
        let data = await response.json();
        if (response.status == 400) {
            alert(data.message);
            return;
        }
        for(let c of data){
            allCategories[c.id] = c;
        }
        SelectCat();
    } catch (err) {
        alert(err)
    }
}

function createTable(data) {
    let txt = "";
    for (obj of data) {
        if (obj) {
            let isChecked = obj.is_done ? "checked" : "";
            let rowClass = obj.is_done ? "class='rowClass'" : "";
            txt += `<tr ${rowClass}>`;
            txt += `<td><input type="checkbox" ${isChecked} onchange="taskDone(${obj.id},this)"></td>`;
            txt += `<td>${obj.text}</td>`;
            txt += `<td>${obj.category_id}</td>`;
            txt += `<td><button onclick="deleteTask(${obj.id})">🗑️</button></td>`;
            txt += `<td><button onclick="taskToEdit(${obj.id})">✏️</button></td>`;
            txt += "</tr>";
        }
    }
    document.getElementById('myTable').innerHTML = txt;
}

async function taskDone(id, elm) {
    let isDone = elm.checked;
    try {
        let response = await fetch(`/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDone })
        })
        getTasks();
    } catch (err) {
        alert(err)
    }
}

function SelectCat(){
    let select = document.getElementById('tasksSelect');
    select.innerHTML = '<option value="">View All Tasks</option>';
    allCategoris.forEach(category =>{
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    })
    select.addEventListener('change', filterTasks);
}

function filterTasks() {
    let select = document.getElementById('tasksSelect');
    let selectedCategoryId = select.value;

    if (selectedCategoryId === '') {
        createTable(allTasks);
    } else {
        let filteredTasks = allTasks.filter(task => task.category_id == selectedCategoryId);
        createTable(filteredTasks);
    }
}

getCategories();
getTasks();