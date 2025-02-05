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
const sortTaskRef = document.querySelector('.sort');

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

// Sort Tasks
sortTaskRef.addEventListener('click', e => {

    tasks.sort((a, b) => b.priority - a.priority);
    renderTasks();
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
        let randomPriority = tasks.length + 1;
        randomPriority %= 4;
        newTask.priority = `${randomPriority}`;
        newTask.content = textareaRef.value;
        newTask.id = Math.floor(Math.random() * 1000);


        createTask(newTask.id, newTask.priority, newTask.content);
        tasks.push(newTask);
        renderTasks();

        removeModal();
    }
})

// Handle Drag and Drop
taskContainer.addEventListener("dragover", (e) => {
    e.preventDefault();

    const afterElement = getDragAfterElement(taskContainer, e.clientY);
    const draggable = document.querySelector(".dragging");

    if (afterElement == null) {
        taskContainer.appendChild(draggable);
    } else {
        taskContainer.insertBefore(draggable, afterElement);
    }
});

// Function to determine the nearest element after drag position
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - (box.top + box.height / 2);

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            }
            return closest;
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
}

// Create Task Function
function createTask(id, priority, content) {
    const taskRef = document.createElement("div");
    taskRef.classList.add("task", "draggable");
    taskRef.setAttribute("draggable", "true");
    taskRef.setAttribute("data-id", id);
    taskRef.setAttribute("data-priority", priority);

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

    taskContainer.appendChild(taskRef);

    // Drag Events
    taskRef.addEventListener("dragstart", () => {
        taskRef.classList.add("dragging");
    });

    taskRef.addEventListener("dragend", () => {
        taskRef.classList.remove("dragging");
        updateLocalStorage(); // Save new order
    });

    // Lock/Unlock Task
    let lockIconFlag = true;
    const lockUnlockIcon = taskRef.querySelector(".fa-solid");
    const deleteIcon = taskRef.querySelector(".delete-icon");
    const textareaContentRef = taskRef.querySelector(".task-content textarea");

    lockUnlockIcon.addEventListener("click", () => {
        lockIconFlag = !lockIconFlag;
        lockUnlockIcon.classList.toggle("fa-lock", lockIconFlag);
        lockUnlockIcon.classList.toggle("fa-unlock", !lockIconFlag);
        textareaContentRef.disabled = lockIconFlag;
        if (!lockIconFlag) textareaContentRef.focus();
    });

    // Delete Task
    deleteIcon.addEventListener("click", () => {
        removeTask(taskRef, id);
        renderTasks();
        updateLocalStorage();
    });

    // Update Task Content
    textareaContentRef.addEventListener("change", (e) => {
        updateTask(id, e.target.value);
        updateLocalStorage();
    });

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

    tasks.forEach(task => {
        createTask(task.id, task.priority, task.content);
    });

    updateLocalStorage();
}

renderTasks();