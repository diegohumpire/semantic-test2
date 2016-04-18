var TodoFormComponent = Vue.extend({
  template: '#todo-form-template',
  data: function() {
    return {
      todoForm: this.$parent.todo  
    }
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
      }
    }
  },
  ready: function() {
    // console.log(this.$parent.todos);
    this.$watch(
      function() {
        return this.$parent.todo
      },
      function(newVal, oldVal) {
        this.todoForm = newVal;
      });
  },
  methods: {           
    newTodo: function() {
      this.todoForm = new newTodoObj();
    },
    saveTodo: function(todo) {
      
      // Valid state from vue-validation
      var isValid = this.$validationTodo.valid;

      if (isValid) {
        
        // If todo is new. TODO: Other way to check this. 
        if (todo.id === 0) {
          
          // Simulate the new autoincrement ID
          todo.id = this.$parent.todos.length + 1;
          this.$parent.todos.push(todo);
          
        } else {
          
          // Find the todo in the array
          var index = this.getById(this.$parent.todos, todo.id);
          this.$parent.todos.$set(index, todo);
        }
        
        // Reset todo's model
        this.todoForm = new newTodoObj();
        
        // Reset validation
        this.$resetValidation();
      }

    },
    removeTodo: function(todo) {
      // vue's way to remove obj from array
      this.todos.$remove(todo);
    },
    // Todo finder
    getById: function(arrayObj, id) {

      // filtering by id
      var objFilter = arrayObj.filter(function(obj) {
        return obj.id == id;
      });

      // first object
      var index = arrayObj.indexOf(objFilter[0]);

      return index;
    },
    // if exists the object
    isEmpty: function(obj) {
      return obj.id === 0 ? true : false;
    }
  }
});

var TodoListComponent = Vue.extend({
  template: '#todo-list-template',
  props: {
    state: {
      coerce: function (val) {
        return (val === 'true')
      }
    }
  },
  data: function() {
    return {
      todo: this.$parent.todo  
    }
  },
  ready: function() {
    // console.log(this.state);
  },
  methods: {
    doneTodo: function(todo) {
      todo.state = true;
      this.todo = new newTodoObj();
    },
    editTodo: function(todo) {
      var todoAux = new newTodoObj(todo);
      this.$parent.$set('todo', todoAux);
    },
    reverseTodo: function(todo) {
      todo.state = false;
    }
  }
});

var TodoComponent = Vue.extend({
  template: '#todo-template',
  components: {
    'todo-form-component': TodoFormComponent,
    'todo-list-component': TodoListComponent
  },
  data: function() {
    return {
      todos: [
        { id: '1', title: 'Task #1', state: false, description: 'Descripcion de la Tarea' },
        { id: '2', title: 'Task #2', state: false, description: 'Descripcion de la Tarea' },
        { id: '3', title: 'Task #3', state: true, description: 'Descripcion de la Tarea' },
        { id: '4', title: 'Task #4', state: false, description: 'Descripcion de la Tarea' }
      ],
      todo: new newTodoObj()
    }    
  }
})

Vue.component('todo-component', TodoComponent);