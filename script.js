let tasks = JSON.parse(localStorage.getItem("tasks") || '[]');

let newTask = {
    priority: '',
    id: '',
    content: ''
};

const priorityFilterBoxRef = document.querySelectorAll('.filters .priority');
const taskContainer = document.querySelector('.task-container');
const createIcon = document.querySelector('.create-icon');
const deleteAction = document.querySelector('.delete-action');
const taskModal = document.querySelector('.task-modal');
const closeButton = document.querySelector('.task-modal .close');
const allPriorityRef = document.querySelectorAll('.task-modal .priority');
const textareaRef = document.querySelector('.task-modal textarea');
const readOnlyButtonRef = document.querySelector('.readonly-icon');
const searchInputRef = document.querySelector('.search-input');

let modalFlag = false;

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
    });
}

priorityFilterBoxRef.forEach(boxRef => {
    boxRef.addEventListener('click', e => {
        applyFilter(e.target.getAttribute('data-priority'));
    });

    boxRef.addEventListener('dblclick', e => {
        applyFilter(0);
    });
});

// Display Modal
createIcon.addEventListener('click', e => {
    modalFlag = !modalFlag;

    if (modalFlag) {
        taskModal.classList.remove('hide');
        taskModal.querySelector('textarea').focus();
    } else {
        taskModal.classList.add('hide');
    }
});

closeButton.addEventListener('click', e => {
    modalFlag = !modalFlag;
    taskModal.classList.add('hide');
});

allPriorityRef.forEach(priorityRef => {
    priorityRef.addEventListener('click', e => {
        allPriorityRef.forEach(priority => priority.classList.remove('selected'));
        e.target.classList.add('selected');
    });
});

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

// Task Area Creation
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
        updateLocalStorage();
    }
});

// Create Task
function createTask(id, priority, content) {
    const taskRef = document.createElement('div');
    taskRef.classList.add('task');
    taskRef.innerHTML = `
        <div class="task-priority priority p${priority}">${priority}</div>
        <div class="task-id">#${id}</div>
        <div class="task-content">
            <textarea spellcheck="false">${content}</textarea>
        </div>
        <div class="task-delete-icon"><i class="fa-solid fa-trash fa-2x"></i></div>
    `;
    taskRef.setAttribute('data-id', id);
    taskRef.setAttribute('data-priority', priority);
    taskContainer.appendChild(taskRef);

    const deleteIcon = taskRef.querySelector('.task-delete-icon');

    // Click on task to show details in the modal
    taskRef.addEventListener('click', () => {
        showTaskDetails(id);
    });

    deleteIcon.addEventListener('click', e => {
        removeTask(taskRef, id);
        renderTasks();
    });

    taskRef.querySelector('.task-content textarea').addEventListener('change', e => {
        updateTaskContent(id, e.target.value);
    });

    updateLocalStorage();
}

function showTaskDetails(id) {
    // Find the task from the global tasks array
    const task = tasks.find(t => t.id === id);
    if (task) {
        const modal = document.querySelector('.task-modal');
        const modalTextarea = modal.querySelector('textarea');
        const closeModalBtn = modal.querySelector('.close');

        modalTextarea.value = task.content;
        modal.classList.remove('hide');

        modalTextarea.addEventListener('change', (e) => {
            console.log(e.target.value);
            updateTaskContent(id, e.target.value);
        });

        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hide');
        });
    }
}


function updateTaskContent(id, newValue) {
    // Update the task in the tasks array
    let idx = tasks.findIndex(task => task.id === id);
    if (idx != -1) {
        const currTask = tasks[idx];
        currTask.content = newValue;
        tasks.splice(idx, 1, currTask);
    }

    // Update local storage after the task content update
    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(taskRef, id) {
    // Remove task from tasks array and update local storage
    tasks = tasks.filter(task => task.id !== id);
    taskRef.remove();
    updateLocalStorage();
}

readOnlyButtonRef.addEventListener('click', function (e) {
    const readOnlyBtnClassList = readOnlyButtonRef.classList;
    if (readOnlyBtnClassList.contains('selected')) {
        readOnlyBtnClassList.remove('selected');
        taskContainer.classList.remove('noneditable');
    } else {
        readOnlyBtnClassList.add('selected');
        taskContainer.classList.add('noneditable');
    }
});

// Render Tasks
function renderTasks() {
    taskContainer.innerHTML = '';
    tasks.forEach(task => {
        createTask(task.id, task.priority, task.content);
    });
    updateLocalStorage();
}

// Search Tasks by Keyword
searchInputRef.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const allTasks = document.querySelectorAll('.task');

    allTasks.forEach(task => {
        const taskContent = task.querySelector('.task-content textarea').value.toLowerCase();
        if (taskContent.includes(keyword)) {
            task.classList.remove('hide');
        } else {
            task.classList.add('hide');
        }
    });
});

renderTasks();
