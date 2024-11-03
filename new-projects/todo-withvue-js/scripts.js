// scripts.js
new Vue({
    el: '#app',
    data: {
        currentDateTime: '',
        newTask: {
            text: '',
            priority: 'normal',
            startDateTime: '',
            endDateTime: ''
        },
        todos: JSON.parse(localStorage.getItem('todos')) || []
    },
    computed: {
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
        addTodo() {
            const { text, priority, startDateTime, endDateTime } = this.newTask;
            if (text && startDateTime && endDateTime) {
                const todo = {
                    id: Date.now(),
                    text,
                    priority,
                    startDateTime: new Date(startDateTime).toISOString(),
                    endDateTime: new Date(endDateTime).toISOString(),
                    status: 'doing',
                    progress: 0,
                    editing: false
                };
                this.todos.push(todo);
                this.saveTodos();
                // Reset the input fields
                this.newTask = {
                    text: '',
                    priority: 'normal',
                    startDateTime: '',
                    endDateTime: ''
                };
            }
        },
        editTask(todo) {
            todo.editing = true;
            todo.editText = todo.text;
            todo.editPriority = todo.priority;
            todo.editStartDateTime = new Date(todo.startDateTime).toISOString().slice(0, 16);
            todo.editEndDateTime = new Date(todo.endDateTime).toISOString().slice(0, 16);
        },
        saveEdit(todo) {
            todo.text = todo.editText;
            todo.priority = todo.editPriority;
            todo.startDateTime = new Date(todo.editStartDateTime).toISOString();
            todo.endDateTime = new Date(todo.editEndDateTime).toISOString();
            todo.editing = false;
            this.saveTodos();
        },
        cancelEdit(todo) {
            todo.editing = false;
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
        formatDate(dateString) {
            return new Date(dateString).toLocaleString();
        },
        getTimeRemaining(todo) {
            if (todo.status === 'done') return 'Completed';
            
            const now = new Date();
            const end = new Date(todo.endDateTime);
            const diff = end - now;
            
            if (diff < 0) return 'Overdue';
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            return `${days}d ${hours}h ${minutes}m ${seconds}s`;
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
        setInterval(this.updateDateTime, 1000);
        setInterval(() => {
            this.$forceUpdate(); // Force update for time remaining
        }, 1000);
    }
  });