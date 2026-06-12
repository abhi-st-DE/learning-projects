/**
 * Todo List Client‑Side Script
 * Implements Task model, CRUD operations, filtering, and persistence via LocalStorage.
 */

/* --------------------------- 1. Data Model --------------------------- */
class Task {
    /**
     * @param {string} id - Unique identifier.
     * @param {string} text - Task description.
     * @param {boolean} [completed=false] - Completion state.
     */
    constructor(id, text, completed = false) {
        this.id = id;
        this.text = text;
        this.completed = completed;
    }

    /** Toggle the completed flag. */
    toggle() {
        this.completed = !this.completed;
    }

    /** Convert the task to a plain object suitable for JSON.stringify. */
    toJSON() {
        return {
            id: this.id,
            text: this.text,
            completed: this.completed,
        };
    }
}

/* ----------------------- 2. Constants & State ----------------------- */
const STORAGE_KEY = 'todo-list-tasks';
let tasks = [];                 // Array of Task instances.
let currentFilter = 'all';      // 'all' | 'active' | 'completed'

/* ------------------- 3. LocalStorage Persistence ------------------- */
function loadTasksFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            tasks = [];
            return;
        }
        const parsed = JSON.parse(raw);
        // Ensure we get an array of objects with expected shape.
        if (Array.isArray(parsed)) {
            tasks = parsed.map(item => new Task(item.id, item.text, item.completed));
        } else {
            tasks = [];
        }
    } catch (e) {
        console.warn('Could not load tasks from localStorage:', e);
        tasks = [];
    }
}

function saveTasksToStorage() {
    try {
        const data = JSON.stringify(tasks.map(t => t.toJSON()));
        localStorage.setItem(STORAGE_KEY, data);
    } catch (e) {
        console.warn('Could not save tasks to localStorage:', e);
    }
}

/* ---------------------------- 4. Rendering ---------------------------- */
function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(t => !t.completed);
        case 'completed':
            return tasks.filter(t => t.completed);
        case 'all':
        default:
            return tasks;
    }
}

function renderTasks() {
    const listEl = document.getElementById('task-list');
    if (!listEl) return;

    // Clear current list.
    listEl.innerHTML = '';

    const filtered = getFilteredTasks();

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'toggle-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

        // Text span
        const span = document.createElement('span');
        span.className = `task-text${task.completed ? ' completed' : ''}`;
        span.textContent = task.text;

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null) {
                const trimmed = newText.trim();
                if (trimmed) {
                    editTask(task.id, trimmed);
                } else {
                    alert('Task text cannot be empty.');
                }
            }
        });

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this task?')) {
                deleteTask(task.id);
            }
        });

        // Assemble
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        listEl.appendChild(li);
    });
}

/* --------------------------- 5. CRUD Ops --------------------------- */
function generateUniqueId() {
    // Primary: timestamp. Fallback: random part if collision.
    let id = Date.now().toString();
    // Ensure uniqueness within current tasks.
    while (tasks.some(t => t.id === id)) {
        id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    }
    return id;
}

function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) {
        alert('Task cannot be empty.');
        return;
    }
    const newTask = new Task(generateUniqueId(), trimmed);
    tasks.push(newTask);
    saveTasksToStorage();
    renderTasks();
}

function editTask(id, newText) {
    const trimmed = newText.trim();
    if (!trimmed) {
        alert('Task cannot be empty.');
        return;
    }
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.text = trimmed;
    saveTasksToStorage();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasksToStorage();
    renderTasks();
}

function toggleTaskCompletion(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.toggle();
    saveTasksToStorage();
    renderTasks();
}

/* ---------------------------- 6. Filtering ---------------------------- */
function setFilter(filter) {
    if (!['all', 'active', 'completed'].includes(filter)) return;
    currentFilter = filter;

    // Update active class on filter buttons.
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderTasks();
}

/* --------------------- 7. Event Handlers & Init --------------------- */
function handleAddTask() {
    const input = document.getElementById('new-task-input');
    if (!input) return;
    const text = input.value;
    addTask(text);
    input.value = '';
}

function attachGlobalEventListeners() {
    const addBtn = document.getElementById('add-task-btn');
    const input = document.getElementById('new-task-input');

    if (addBtn) {
        addBtn.addEventListener('click', handleAddTask);
    }

    if (input) {
        input.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTask();
            }
        });
    }

    // Filter buttons – expected markup: <button class="filter-btn" data-filter="all">All</button>
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        const filter = btn.dataset.filter;
        if (filter) {
            btn.addEventListener('click', () => setFilter(filter));
        }
    });
}

/* -------------------------- 8. Initialization -------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    renderTasks();
    attachGlobalEventListeners();
});