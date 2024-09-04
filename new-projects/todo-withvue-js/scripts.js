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
            return now.toISOString().slice(0, 16); // For datetime-local format
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
        addTodo() {
            const { text, priority, endDateTime } = this.newTask;
            const startDateTime = this.currentDateTimeInput;

            if (text && startDateTime && endDateTime) {
                const todo = {
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

                // Note: startDateTime will always be the current date/time
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
        setInterval(this.updateDateTime, 1000); // Update the current date and time every second
    }
});
