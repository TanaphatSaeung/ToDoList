const taskInput = document.querySelector('.task-input input'),
filter = document.querySelectorAll('.filters span'),
taskBox = document.querySelector('.task-box')
clearAll = document.querySelector('.clear-btn')

let editId;
let flag;
let isEditedTask = false
// getting local storage todo list
let todos = JSON.parse(localStorage.getItem('todo-list'))

filter.forEach(btn => {
    btn.addEventListener('click',() => {
        document.querySelector('span.active').classList.remove('active')
        btn.classList.add('active')
        showTodo(btn.id)
    })
})
// ------------------------------------------------------------------------------
const showTodo = (filter) => {
    let li = ''
    if(todos){
        todos.forEach((todo,id) => {
        let isCompleted = todo.status == 'completed'? 'checked' : ''
        if(filter == todo.status || filter == 'all'){
            li += `<li class="task">
                <label for="${id}">
                    <input type="checkbox" onclick='updateStatus(this)' id="${id}" ${isCompleted}>
                    <p class='${isCompleted}' >${todo.name}</p>
                </label>
                <div class="setting">
                    <i onclick='showMenu(this)' class="fa-solid fa-ellipsis"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${id},'${todo.name}')"><i class="fa-solid fa-pen"></i>Edit</li>
                        <li onclick='deleteTask(${id})'><i class="fa-solid fa-trash"></i>Delete</li>
                    </ul>
                </div>
            </li>`
        }
        });
    }
    taskBox.innerHTML = li || `<span class='empty'> You don't Have any task here </span>`
}
showTodo('all')
// ------------------------------------------------------------------------------
const updateStatus = (selectedTask) =>{
    let taskName = selectedTask.parentElement.lastElementChild
    if (selectedTask.checked){
        taskName.classList.add('checked')
        // updating the status of selected task to complete
        todos[selectedTask.id].status = 'completed'
    }else{
        taskName.classList.remove('checked')
        // updating the status of selected task to pending
        todos[selectedTask.id].status = 'pending'
    }
    localStorage.setItem('todo-list', JSON.stringify(todos))
}
// ------------------------------------------------------------------------------
const showMenu = (selectedTask) => {
    // getting task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild
    taskMenu.classList.add('show')
    document.addEventListener('click', e => {
        // removing the show class 
        if(e.target.tagName != 'I' || e.target != selectedTask){
            taskMenu.classList.remove('show')
        }
    })
}
// ------------------------------------------------------------------------------
const deleteTask = (deletedId) => {
    // removing selected task from array/todos
    todos.splice(deletedId, 1)
    localStorage.setItem('todo-list', JSON.stringify(todos))
    filter.forEach(() => {
        if (document.querySelector('span.active')){
            showTodo(document.querySelector('span.active').id)
        }
    })
}
// ------------------------------------------------------------------------------
clearAll.addEventListener('click',()=>{
    todos.splice(0,todos.length)
    localStorage.setItem('todo-list', JSON.stringify(todos))
    backToAll()
})
// ------------------------------------------------------------------------------
const editTask = (taskId,taskName) => {
    editId = taskId
    isEditedTask = true
    taskInput.value = taskName
}
// ------------------------------------------------------------------------------
taskInput.addEventListener('keyup', e=>{ 
    let userTask = taskInput.value.trim()
    if(e.key == 'Enter' && userTask){
        if(!isEditedTask){
            if(!todos){ // if todo doesn't exist, pass an rmty array todos
                todos = []
            }
            let taskInfo = {name: userTask, status:'pending'}
            todos.push(taskInfo) // adding new task
        } else {
            isEditedTask = false
            flag = 'Y'
            console.log(flag, isEditedTask);
            
            todos[editId].name = userTask
        }
        taskInput.value = '' 
        localStorage.setItem('todo-list', JSON.stringify(todos))
        queryID = document.querySelector('span.active').id
        
        for(let i = 0;i <= queryID.length;i++){
            if(queryID == 'completed'){
                if (flag === 'Y') {
                    console.log('com',flag);
                    flag = ''
                    showTodo(queryID)
                    break
                }else{
                    console.log(flag);
                    backToAll()
                }
            }else if(queryID == 'pending'){
                showTodo(queryID)
            }
            else{
                console.log(queryID);
                backToAll()
            }
        }
    }
})
// ------------------------------------------------------------------------------
const backToAll = () =>{
    filter.forEach(() => {
        if (document.querySelector('span.active').id != 'all'){
            document.querySelector('span.active').classList.remove('active')     
            document.getElementById('all').classList.add('active')
        }
        showTodo('all')
    })
}
