document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const prioritySelect = document.getElementById('priority-select');
    const deadlineInput = document.getElementById('deadline-input');
    const todoList = document.getElementById('todo-list');
    const currentDateTimeElement = document.getElementById('current-datetime');
    const totalTasksElement = document.getElementById('total-tasks');
    const completedTasksElement = document.getElementById('completed-tasks');
    const completionRateElement = document.getElementById('completion-rate');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function updateDateTime() {
        const now = new Date();
        currentDateTimeElement.textContent = now.toLocaleString();
    }

    function updateTaskStats() {
        const totalTasks = todos.length;
        const completedTasks = todos.filter(todo => todo.status === 'done').length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        totalTasksElement.textContent = totalTasks;
        completedTasksElement.textContent = completedTasks;
        completionRateElement.textContent = `${completionRate}%`;
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateTaskStats();
    }

    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.setAttribute('data-priority', todo.priority);
        li.setAttribute('data-status', todo.status);

        const taskInfo = document.createElement('div');
        taskInfo.className = 'task-info';
        taskInfo.innerHTML = `
            <span class="task-text">${todo.text}</span>
            <span class="task-priority">${todo.priority}</span>
            <span class="task-deadline">${new Date(todo.deadline).toLocaleString()}</span>
            <div class="task-progress">
                <div class="task-progress-bar" style="width: ${todo.progress}%"></div>
            </div>
        `;

        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            todos = todos.filter(t => t !== todo);
            saveTodos();
            renderTodos();
        });

        const statusBtn = document.createElement('button');
        statusBtn.textContent = todo.status === 'done' ? 'Undo' : 'Done';
        statusBtn.addEventListener('click', () => {
            todo.status = todo.status === 'done' ? 'doing' : 'done';
            todo.progress = todo.status === 'done' ? 100 : 0;
            saveTodos();
            renderTodos();
        });

        const progressInput = document.createElement('input');
        progressInput.type = 'number';
        progressInput.min = 0;
        progressInput.max = 100;
        progressInput.value = todo.progress;
        progressInput.addEventListener('change', (e) => {
            todo.progress = parseInt(e.target.value);
            saveTodos();
            renderTodos();
        });

        taskActions.appendChild(deleteBtn);
        taskActions.appendChild(statusBtn);
        taskActions.appendChild(progressInput);

        li.appendChild(taskInfo);
        li.appendChild(taskActions);

        return li;
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const todoElement = createTodoElement(todo);
            todoList.appendChild(todoElement);
        });
    }

    function addTodo(e) {
        e.preventDefault();
        const text = todoInput.value.trim();
        const priority = prioritySelect.value;
        const deadline = new Date(deadlineInput.value);

        if (text && deadline) {
            const todo = {
                text,
                priority,
                deadline: deadline.toISOString(),
                status: 'doing',
                progress: 0
            };

            todos.push(todo);
            saveTodos();
            renderTodos();

            todoInput.value = '';
            deadlineInput.value = '';
        }
    }

    function checkDeadlines() {
        const now = new Date();
        todos.forEach(todo => {
            const deadline = new Date(todo.deadline);
            const timeDiff = deadline - now;
            const hoursDiff = timeDiff / (1000 * 60 * 60);

            const todoElement = document.querySelector(`[data-id="${todo.id}"]`);
            if (todoElement) {
                if (hoursDiff <= 1) {
                    todoElement.style.backgroundColor = '#e74c3c'; // Red
                } else if (hoursDiff <= 3) {
                    todoElement.style.backgroundColor = '#e67e22'; // Orange
                } else if (hoursDiff <= 12) {
                    todoElement.style.backgroundColor = '#f1c40f'; // Yellow
                } else if (hoursDiff <= 24) {
                    todoElement.style.backgroundColor = '#2ecc71'; // Green
                }

                if (hoursDiff <= 1 && todo.priority === 'urgent') {
                    const countdown = document.createElement('div');
                    countdown.className = 'countdown';
                    countdown.textContent = `Time remaining: ${Math.floor(timeDiff / (1000 * 60))} minutes`;
                    todoElement.appendChild(countdown);
                }
            }
        });
    }

    todoForm.addEventListener('submit', addTodo);

    setInterval(updateDateTime, 1000);
    setInterval(checkDeadlines, 60000); // Check deadlines every minute

    updateDateTime();
    renderTodos();
    updateTaskStats();
});
