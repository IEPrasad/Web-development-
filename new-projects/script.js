document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const prioritySelect = document.getElementById('priority-select');
  const startDateTimeInput = document.getElementById('start-datetime');
  const endDateTimeInput = document.getElementById('end-datetime');
  const todoList = document.getElementById('todo-list');
  const currentDateTimeElement = document.getElementById('current-datetime');
  const totalTasksElement = document.getElementById('total-tasks');
  const completedTasksElement = document.getElementById('completed-tasks');
  const completionRateElement = document.getElementById('completion-rate');

  let todos = JSON.parse(localStorage.getItem('todos')) || [];

  function updateDateTime() {
      const now = new Date();
      currentDateTimeElement.textContent = now.toLocaleString();
      
      // Set the default start time to now
      const nowString = now.toISOString().slice(0, 16);
      if (!startDateTimeInput.value) {
          startDateTimeInput.value = nowString;
      }
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
          <div class="task-text">${todo.text}</div>
          <div class="task-priority">${todo.priority}</div>
          <div class="task-start-time">Start: ${new Date(todo.startDateTime).toLocaleString()}</div>
          <div class="task-end-time">End: ${new Date(todo.endDateTime).toLocaleString()}</div>
          <div class="timer">Time remaining: Calculating...</div>
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
      updateTimers();
  }

  function addTodo(e) {
      e.preventDefault();
      const text = todoInput.value.trim();
      const priority = prioritySelect.value;
      const startDateTime = new Date(startDateTimeInput.value);
      const endDateTime = new Date(endDateTimeInput.value);

      if (text && startDateTime && endDateTime) {
          const todo = {
              text,
              priority,
              startDateTime: startDateTime.toISOString(),
              endDateTime: endDateTime.toISOString(),
              status: 'doing',
              progress: 0
          };

          todos.push(todo);
          saveTodos();
          renderTodos();

          todoInput.value = '';
          startDateTimeInput.value = '';
          endDateTimeInput.value = '';
          updateDateTime(); // Reset start time to now
      }
  }

  function updateTimers() {
      const now = new Date();
      todos.forEach(todo => {
          const todoElement = document.querySelector(`[data-priority="${todo.priority}"]`);
          if (todoElement) {
              const endTime = new Date(todo.endDateTime);
              const timeDiff = endTime - now;
              const hoursDiff = timeDiff / (1000 * 60 * 60);

              const timerElement = todoElement.querySelector('.timer');
              if (timerElement) {
                  if (timeDiff > 0) {
                      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                      timerElement.textContent = `Time remaining: ${days}d ${hours}h ${minutes}m`;
                  } else {
                      timerElement.textContent = "Time's up!";
                  }
              }

              if (hoursDiff <= 1) {
                  todoElement.style.backgroundColor = 'rgba(231, 76, 60, 0.2)'; // Red
              } else if (hoursDiff <= 3) {
                  todoElement.style.backgroundColor = 'rgba(230, 126, 34, 0.2)'; // Orange
              } else if (hoursDiff <= 12) {
                  todoElement.style.backgroundColor = 'rgba(241, 196, 15, 0.2)'; // Yellow
              } else if (hoursDiff <= 24) {
                  todoElement.style.backgroundColor = 'rgba(46, 204, 113, 0.2)'; // Green
              }
          }
      });
  }

  todoForm.addEventListener('submit', addTodo);

  // Update date and time every second
  setInterval(updateDateTime, 1000);
  
  // Update timers every minute
  setInterval(() => {
      updateTimers();
      updateTaskStats();
  }, 60000);

  // Initial renders
  updateDateTime();
  renderTodos();
  updateTaskStats();
});