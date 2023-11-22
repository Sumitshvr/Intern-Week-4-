document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");

    // Retrieve tasks from local storage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Display existing tasks
    tasks.forEach(task => addTaskToDOM(task));

    // Event listener for adding a new task
    addTaskBtn.addEventListener("click", function () {
        if (taskInput.value.trim() !== "") {
            const newTask = { id: Date.now(), text: taskInput.value, completed: false };
            tasks.push(newTask);
            addTaskToDOM(newTask);
            updateLocalStorage();
            taskInput.value = "";
        }
    });

    // Function to add a task to the DOM
    function addTaskToDOM(task) {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");
        if (task.completed) {
            taskItem.classList.add("completed");
        }

        taskItem.innerHTML = `
            <div class="task-text ${task.completed ? 'completed' : ''}" onclick="editTask(${task.id})">${task.text}</div>
            <div class="task-buttons">
                <button onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(taskItem);
    }

    // Function to edit a task
    window.editTask = function (taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        const newText = prompt("Edit task:", tasks[taskIndex].text);

        if (newText !== null) {
            tasks[taskIndex].text = newText;
            updateLocalStorage();
            renderTaskList();
        }
    };

    // Function to toggle the completion status of a task
    window.toggleTask = function (taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        updateLocalStorage();
        renderTaskList();
    };

    // Function to delete a task
    window.deleteTask = function (taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        tasks.splice(taskIndex, 1);
        updateLocalStorage();
        renderTaskList();
    };

    // Function to update local storage with the current task list
    function updateLocalStorage() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Function to render the task list
    function renderTaskList() {
        taskList.innerHTML = "";
        tasks.forEach(task => addTaskToDOM(task));
    }
});

document.addEventListener("DOMContentLoaded", function () {
    function makeTasksDraggable() {
        const taskItems = document.querySelectorAll('.task-item');

        taskItems.forEach(taskItem => {
            taskItem.draggable = true;

            taskItem.addEventListener('dragstart', function (event) {
                event.dataTransfer.setData('text/plain', taskItem.id);
            });
        });
    }

    window.allowDrop = function (event) {
        event.preventDefault();
    };


    window.drop = function (event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        const draggedTask = document.getElementById(data);
        const dropTarget = event.target.closest('.task-item');

        if (dropTarget) {
            const taskList = document.getElementById('task-list');
            taskList.insertBefore(draggedTask, dropTarget.nextSibling);
        }

        makeTasksDraggable();
    };
    makeTasksDraggable();
});

