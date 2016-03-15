var todosList = [
  { id:'1', title: 'Task #1', state: false, description: 'Descripcion de la Tarea' },
  { id:'2', title: 'Task #2', state: false, description: 'Descripcion de la Tarea' },
  { id:'3', title: 'Task #3', state: true, description: 'Descripcion de la Tarea' },
  { id:'4', title: 'Task #4', state: false, description: 'Descripcion de la Tarea' }
];

var newTodoObj = function(props) {
  
  var todo = {};
  
  if(typeof props == "undefined") {
    todo.id = 0;
    todo.title = '';
    todo.state = false;
    todo.description = '';  
  } else {
    todo.id = props.id;
    todo.title = props.title;
    todo.state = props.state;
    todo.description = props.description;
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
