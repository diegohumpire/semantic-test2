var todosList = [
  { id:'1', task: 'Task #1', state: false, text: 'Descripcion de la Tarea' },
  { id:'2', task: 'Task #2', state: false, text: 'Descripcion de la Tarea' },
  { id:'3', task: 'Task #3', state: true, text: 'Descripcion de la Tarea' },
  { id:'4', task: 'Task #4', state: false, text: 'Descripcion de la Tarea' }
];

var newTodoObj = function(props) {
  
  var todo = {};
  
  if(typeof props == "undefined") {
    todo.id = 0;
    todo.task = '';
    todo.state = false;
    todo.text = '';  
  } else {
    todo.id = props.id;
    todo.task = props.task;
    todo.state = props.state;
    todo.text = props.text;
  }
  
  return todo;
};

new Vue({
  el: '#app',
  data: {
    todos: todosList,
    todo: new newTodoObj()
  },
  methods: {
    doneTodo: function(todo) {
      todo.state = true;
    },
    reverseTodo: function(todo) {
      todo.state = false;
    },
    editTodo: function(todo) {
      var todoAux = new newTodoObj(todo);
      this.todo = todoAux;
    },
    newTodo: function() {
      this.todo = new newTodoObj();
    },
    saveTodo: function(todo) {
      if(todo.id === 0) {
        todo.id = this.todos.length + 1;
        this.todos.push(todo);
      } else {
        var todoOld = this.todos.filter(function(obj) {
          return obj.id == todo.id;
        });
        var index = this.todos.indexOf(todoOld[0]);
        this.todos.$set(index, todo);
      }
      this.todo = new newTodoObj();  
    }
  }
});
