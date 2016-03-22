var todosList = [
  { id:'1', title: 'Task #1', state: false, description: 'Descripcion de la Tarea' },
  { id:'2', title: 'Task #2', state: false, description: 'Descripcion de la Tarea' },
  { id:'3', title: 'Task #3', state: true, description: 'Descripcion de la Tarea' },
  { id:'4', title: 'Task #4', state: false, description: 'Descripcion de la Tarea' }
];

var newTodoObj = function(props) {
  var todo = props || {};
  this.id = todo.id || 0;
  this.title = todo.title || '';
  this.state = todo.state || false;
  this.description = todo.description || '';
};

var getById = function(arrayObj, id) {
  var objFilter = arrayObj.filter(function(obj) {
    return obj.id == id;
  });
  var index = arrayObj.indexOf(objFilter[0]);
  
  return index;
};

var isEmpty = function(obj) {
  return obj.id === 0 ? true : false;
};

var vm = new Vue({
  el: '#app',
  data: {
    todos: todosList,
    todo: new newTodoObj()
  },
  computed: {
    validation: function() {
      return {
        title: this.$validationTodo.title.touched ? this.$validationTodo.title.valid : true,
        description: this.$validationTodo.description.touched ? this.$validationTodo.description.valid : true
      };
    }
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
      var isValid = this.$validationTodo.valid;
      
      if (isValid) {
        if(todo.id === 0) {
          todo.id = this.todos.length + 1;
          this.todos.push(todo);
        } else {
          var index = getById(this.todos, todo.id);
          this.todos.$set(index, todo);
        }
        this.todo = new newTodoObj();  
      }
      
    },
    removeTodo: function(todo) {
      this.todos.$remove(todo);
    }
  }
});
