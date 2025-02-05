let tasks = JSON.parse(localStorage.getItem("tasks") || '[]');

let newTask = {
    priority: '',
    id: '',
    content: ''
}

const priorityFilterBoxRef = document.querySelectorAll('.filters .priority');
const taskContainer = document.querySelector('.task-container');
const createIcon = document.querySelector('.create-icon');
const taskModal = document.querySelector('.task-modal');
const closeButton = document.querySelector('.task-modal .close');
const allPriorityRef = document.querySelectorAll('.task-modal .priority');
const textareaRef = document.querySelector('.task-modal textarea');
const showAllTasksRef = document.querySelector('.show-all');

let modalFlag = false;
let lockIconFlag = false;

// Filter Tickets
function applyFilter(priority) {

    let allTasks = document.querySelectorAll('.task');
    allTasks.forEach(task => {
        const curr = task.getAttribute('data-priority');

        if (priority == 0)
            task.classList.remove('hide');

        else if (curr != priority)
            task.classList.add('hide');

        else
            task.classList.remove('hide');
    })
}

priorityFilterBoxRef.forEach(boxRef => {
    boxRef.addEventListener('click', e => {
        applyFilter(e.target.getAttribute('data-priority'));
    })
})

showAllTasksRef.addEventListener('click', e => {
    applyFilter(0);
})

// Display Modal
createIcon.addEventListener('click', e => {

    modalFlag = !modalFlag;

    if (modalFlag)
        taskModal.classList.remove('hide');

    else
        taskModal.classList.add('hide');

})

closeButton.addEventListener('click', e => {

    modalFlag = !modalFlag;

    taskModal.classList.add('hide');
})

allPriorityRef.forEach(priorityRef => {

    priorityRef.addEventListener('click', e => {

        allPriorityRef.forEach(priority => priority.classList.remove('selected'));
        e.target.classList.add('selected');
    })
})

function removeModal() {
    newTask = {
        priority: '',
        id: '',
        content: ''
    };
    modalFlag = !modalFlag;
    taskModal.classList.add('hide');
    textareaRef.value = '';
}

// TaskArea Creation
textareaRef.addEventListener('keypress', e => {

    if (e.key == "Enter") {
        let randomPriority = Math.floor(Math.random() * 3) + 1;
        newTask.priority = `${randomPriority}`;
        newTask.content = textareaRef.value;
        newTask.id = Math.floor(Math.random() * 1000);


        createTask(newTask.id, newTask.priority, newTask.content);
        tasks.push(newTask);
        renderTasks();

        removeModal();
    }
})

// Create Task
function createTask(id, priority, content) {

    const taskRef = document.createElement('div');
    taskRef.classList.add('task');
    taskRef.innerHTML = `
        <div class="task-priority priority p${priority}">${priority}</div>
        <div class="task-id">#${id}</div>
        <div class="task-content">
            <textarea disabled spellcheck="false">${content}</textarea>
        </div>
        <div class="icons">
            <div class="lock-unlock-icon"><i class="fa-solid fa-lock fa-2x"></i></div>
            <div class="delete-icon"><i class="fa-solid fa-trash fa-2x"></i></div>
        </div>
    `;
    taskRef.setAttribute('data-id', id);
    taskRef.setAttribute('data-priority', priority);
    taskContainer.appendChild(taskRef);

    const lockUnlockIcon = taskRef.querySelector('.fa-solid');
    const deleteIcon = taskRef.querySelector('.delete-icon');
    const textareaContentRef = taskRef.querySelector('.task-content textarea');

    lockUnlockIcon.addEventListener('click', e => {

        lockIconFlag = !lockIconFlag;

        if (lockIconFlag) {
            lockUnlockIcon.classList.remove('fa-lock');
            lockUnlockIcon.classList.add('fa-unlock');
            textareaContentRef.disabled = false;
            textareaRef.focus();
        }

        else {
            lockUnlockIcon.classList.remove('fa-unlock');
            lockUnlockIcon.classList.add('fa-lock');
            textareaContentRef.disabled = true;
        }
    })

    deleteIcon.addEventListener('click', e => {
        removeTask(taskRef, id);
        renderTasks();
    })

    taskRef.querySelector('.task-content textarea').addEventListener('change', e => {
        updateTask(id, e.target.value);
    })

    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function updateTask(id, newValue) {

    let idx = tasks.findIndex(task => task.id === id);

    if (idx != -1) {
        const currTask = tasks[idx];
        currTask.content = newValue;
        tasks.splice(idx, 1, currTask);
    }

    updateLocalStorage();
}

function removeTask(taskRef, id) {
    tasks = tasks.filter(task => task.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskRef.remove();
}

// Render Tasks
function renderTasks() {

    taskContainer.innerHTML = '';

    tasks.sort((a, b) => a.priority - b.priority);

    tasks.forEach(task => {
        createTask(task.id, task.priority, task.content);
    });

    updateLocalStorage();
}

renderTasks();