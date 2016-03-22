// Todos
var todosList = [
  { id: '1', title: 'Task #1', state: false, description: 'Descripcion de la Tarea' },
  { id: '2', title: 'Task #2', state: false, description: 'Descripcion de la Tarea' },
  { id: '3', title: 'Task #3', state: true, description: 'Descripcion de la Tarea' },
  { id: '4', title: 'Task #4', state: false, description: 'Descripcion de la Tarea' }
];

// Todo Constructor
var newTodoObj = function(props) {

  // New object
  var todo = props || {};

  this.id = todo.id || 0;
  this.title = todo.title || '';
  this.state = todo.state || false;
  this.description = todo.description || '';
};

// Todo finder
var getById = function(arrayObj, id) {

  // filtering by id
  var objFilter = arrayObj.filter(function(obj) {
    return obj.id == id;
  });

  // first object
  var index = arrayObj.indexOf(objFilter[0]);

  return index;
};

// if exists the object
var isEmpty = function(obj) {
  return obj.id === 0 ? true : false;
};

// Vue Object
var vm = new Vue({
  el: '#app',
  data: {
    todos: todosList,
    todo: new newTodoObj()
  },
  computed: {
    /**
     * Return a object with the valid state of properties 
     * by default returns true, after a model's property is touched, change the valid state
     */
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
      this.todo = new newTodoObj();
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
      
      // Valid state from vue-validation
      var isValid = this.$validationTodo.valid;

      if (isValid) {
        
        // If todo is new. TODO: Other way to check this. 
        if (todo.id === 0) {
          
          // Simulate the new autoincrement ID
          todo.id = this.todos.length + 1;
          this.todos.push(todo);
          
        } else {
          
          // Find the todo in the array
          var index = getById(this.todos, todo.id);
          this.todos.$set(index, todo);
        }
        
        // Reset todo's model
        this.todo = new newTodoObj();
        
        // Reset validation
        this.$resetValidation();
      }

    },
    removeTodo: function(todo) {
      
      // vue's way to remove obj from array
      this.todos.$remove(todo);
    }
  }
});
