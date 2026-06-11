// Get the task list container, form, and user information section from the DOM
const taskListContainer = document.getElementById('task-list-container');
const taskForm = document.getElementById('task-form');
const userInfoSection = document.getElementById('user-info-section');

// Initialize an empty array to store tasks
let tasks = [];

// Function to create a new task
function createTask(title, description, dueDate, priority, category) {
    // Create a new task object
    const task = {
        id: Date.now(),
        title,
        description,
        dueDate,
        priority,
        category,
        completed: false,
    };

    // Add the task to the tasks array
    tasks.push(task);

    // Render the task in the task list container
    renderTask(task);
}

// Function to get all tasks
function getTasks() {
    // Return the tasks array
    return tasks;
}

// Function to update a task
function updateTask(id, title, description, dueDate, priority, category) {
    // Find the task with the given id
    const taskIndex = tasks.findIndex((task) => task.id === id);

    // If the task exists, update its properties
    if (taskIndex !== -1) {
        tasks[taskIndex].title = title;
        tasks[taskIndex].description = description;
        tasks[taskIndex].dueDate = dueDate;
        tasks[taskIndex].priority = priority;
        tasks[taskIndex].category = category;
    }

    // Render the updated task in the task list container
    renderTask(tasks[taskIndex]);
}

// Function to delete a task
function deleteTask(id) {
    // Find the task with the given id
    const taskIndex = tasks.findIndex((task) => task.id === id);

    // If the task exists, remove it from the tasks array
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
    }

    // Render the updated task list in the task list container
    renderTaskList();
}

// Function to render a task in the task list container
function renderTask(task) {
    // Create a new task element
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');

    // Create task title, description, due date, priority, and category elements
    const titleElement = document.createElement('h2');
    titleElement.textContent = task.title;
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = task.description;
    const dueDateElement = document.createElement('p');
    dueDateElement.textContent = `Due Date: ${task.dueDate}`;
    const priorityElement = document.createElement('p');
    priorityElement.textContent = `Priority: ${task.priority}`;
    const categoryElement = document.createElement('p');
    categoryElement.textContent = `Category: ${task.category}`;

    // Create edit and delete buttons
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
        // Open the edit task form
        const editTaskForm = document.getElementById('edit-task-form');
        editTaskForm.style.display = 'block';

        // Populate the edit task form with the task's properties
        const editTaskTitleInput = document.getElementById('edit-task-title');
        editTaskTitleInput.value = task.title;
        const editTaskDescriptionInput = document.getElementById('edit-task-description');
        editTaskDescriptionInput.value = task.description;
        const editTaskDueDateInput = document.getElementById('edit-task-due-date');
        editTaskDueDateInput.value = task.dueDate;
        const editTaskPriorityInput = document.getElementById('edit-task-priority');
        editTaskPriorityInput.value = task.priority;
        const editTaskCategoryInput = document.getElementById('edit-task-category');
        editTaskCategoryInput.value = task.category;

        // Add an event listener to the edit task form submit button
        const editTaskFormSubmitButton = document.getElementById('edit-task-form-submit');
        editTaskFormSubmitButton.addEventListener('click', () => {
            // Get the updated task properties from the edit task form
            const updatedTitle = editTaskTitleInput.value;
            const updatedDescription = editTaskDescriptionInput.value;
            const updatedDueDate = editTaskDueDateInput.value;
            const updatedPriority = editTaskPriorityInput.value;
            const updatedCategory = editTaskCategoryInput.value;

            // Update the task with the given id
            updateTask(task.id, updatedTitle, updatedDescription, updatedDueDate, updatedPriority, updatedCategory);

            // Close the edit task form
            editTaskForm.style.display = 'none';
        });
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        // Delete the task with the given id
        deleteTask(task.id);
    });

    // Append the task elements to the task element
    taskElement.appendChild(titleElement);
    taskElement.appendChild(descriptionElement);
    taskElement.appendChild(dueDateElement);
    taskElement.appendChild(priorityElement);
    taskElement.appendChild(categoryElement);
    taskElement.appendChild(editButton);
    taskElement.appendChild(deleteButton);

    // Append the task element to the task list container
    taskListContainer.appendChild(taskElement);
}

// Function to render the task list in the task list container
function renderTaskList() {
    // Clear the task list container
    taskListContainer.innerHTML = '';

    // Render each task in the tasks array
    tasks.forEach((task) => {
        renderTask(task);
    });
}

// Add an event listener to the task form submit button
const taskFormSubmitButton = document.getElementById('task-form-submit');
taskFormSubmitButton.addEventListener('click', () => {
    // Get the task properties from the task form
    const titleInput = document.getElementById('task-title');
    const descriptionInput = document.getElementById('task-description');
    const dueDateInput = document.getElementById('task-due-date');
    const priorityInput = document.getElementById('task-priority');
    const categoryInput = document.getElementById('task-category');

    const title = titleInput.value;
    const description = descriptionInput.value;
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;
    const category = categoryInput.value;

    // Create a new task with the given properties
    createTask(title, description, dueDate, priority, category);

    // Clear the task form
    titleInput.value = '';
    descriptionInput.value = '';
    dueDateInput.value = '';
    priorityInput.value = '';
    categoryInput.value = '';
});

// Initialize the task list
renderTaskList();