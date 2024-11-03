new Vue({
  el: '#app',
  data: {
      currentDateTime: '',
      newTask: {
          text: '',
          priority: 'normal',
          endDateTime: ''
      },
      todos: JSON.parse(localStorage.getItem('todos')) || []
  },
  computed: {
      currentDateTimeInput() {
          const now = new Date();
          return now.toISOString().slice(0, 16);
      },
      totalTasks() {
          return this.todos.length;
      },
      completedTasks() {
          return this.todos.filter(todo => todo.status === 'done').length;
      },
      completionRate() {
          return this.totalTasks > 0 ? Math.round((this.completedTasks / this.totalTasks) * 100) : 0;
      }
  },
  methods: {
      updateDateTime() {
          const now = new Date();
          this.currentDateTime = now.toLocaleString();
      },
      formatDate(dateString) {
          return new Date(dateString).toLocaleString();
      },
      getTimeRemaining(todo) {
          if (todo.status === 'done') {
              return 'Completed';
          }

          const now = new Date().getTime();
          const endTime = new Date(todo.endDateTime).getTime();
          const timeDiff = endTime - now;

          if (timeDiff <= 0) {
              return 'Overdue';
          }

          // Convert time difference to days, hours, minutes, seconds
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

          // Build the time remaining string
          let timeString = '';
          if (days > 0) timeString += `${days}d `;
          if (hours > 0) timeString += `${hours}h `;
          if (minutes > 0) timeString += `${minutes}m `;
          timeString += `${seconds}s`;

          return timeString;
      },
      addTodo() {
          const { text, priority, endDateTime } = this.newTask;
          const startDateTime = this.currentDateTimeInput;

          if (text && startDateTime && endDateTime) {
              const todo = {
                  id: Date.now().toString(), // Unique ID for each todo
                  text,
                  priority,
                  startDateTime: new Date(startDateTime).toISOString(),
                  endDateTime: new Date(endDateTime).toISOString(),
                  status: 'doing',
                  progress: 0
              };

              this.todos.push(todo);
              this.saveTodos();

              // Reset the input fields
              this.newTask.text = '';
              this.newTask.priority = 'normal';
              this.newTask.endDateTime = '';
          }
      },
      toggleStatus(todo) {
          todo.status = todo.status === 'done' ? 'doing' : 'done';
          todo.progress = todo.status === 'done' ? 100 : 0;
          this.saveTodos();
      },
      deleteTask(todo) {
          this.todos = this.todos.filter(t => t !== todo);
          this.saveTodos();
      },
      saveTodos() {
          localStorage.setItem('todos', JSON.stringify(this.todos));
      },
      sendMail() {
          const subject = encodeURIComponent('Problem with Todo List');
          const body = encodeURIComponent('I am experiencing the following problem with the Todo List:');
          const mailtoLink = `mailto:ieprasad23@gmail.com?subject=${subject}&body=${body}`;
          window.location.href = mailtoLink;
      }
  },
  mounted() {
      this.updateDateTime();
      // Update current date/time every second
      setInterval(this.updateDateTime, 1000);
      // Update time remaining for all todos every second
      setInterval(() => {
          this.$forceUpdate();
      }, 1000);
  }
});
