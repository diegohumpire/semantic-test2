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
        // Create
        if (todo.id === 0) {
          
          this.$http({
            url: appUrls.tasks, 
            method: 'POST',
            headers: {
              'Authorization': 'Token ' + router.app.userAuth.token
            },
            data: {
              title: this.todoForm.title,
              description: this.todoForm.description,
              state: this.todoForm.state
            }
          }).then(
              function(response) {
                todo.id = response.data.id;
                todo.publish_date = response.data.publish_date;
                this.$parent.todos.push(todo);
              },
              function(response) {});
        // Update
        } else {
          // Find the todo in the array
          this.$http({
            url: appUrls.tasks + this.todoForm.id + '/', 
            method: 'PUT',
            headers: {
              'Authorization': 'Token ' + router.app.userAuth.token
            },
            data: {
              id: this.todoForm.id,
              title: this.todoForm.title,
              description: this.todoForm.description,
              state: this.todoForm.state
            }
          }).then(
              function(response) {
                var index = this.getById(this.$parent.todos, todo.id);
                this.$parent.todos.$set(index, todo);
              },
              function(response) {});
        }
        
        // Reset todo's model
        this.todoForm = new newTodoObj();
        
        // Reset validation
        this.$resetValidation();
        $('.ui.basic.modal')
          .modal('setting', 'transition', 'vertical flip')
          .modal('hide');
      }

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
    },
    closeModal: function() {
      $('.ui.basic.modal').modal('hide');
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
      lastTodo: this.$parent.todo  
    }
  },
  ready: function() {
    
  },
  methods: {
    doneTodo: function(todo) {
      
      todo.state = true;
      
      this.$http({
        url: appUrls.tasks + todo.id + '/', 
        method: 'PUT',
        headers: {
          'Authorization': 'Token ' + router.app.userAuth.token
        },
        data: {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          state: todo.state
        }
      })
      .then(
        function(response) {
          console.log(response);
          this.$parent.todo = new newTodoObj();
        },
        function(response) {
          console.log(response);
      });
    },
    removeTodo: function(todo) {
      
      var dialong = confirm('Do you really want remove this task?');
      
      if(dialong) {
        this.$http({
        url: appUrls.tasks + todo.id + '/', 
        method: 'DELETE',
        headers: {
          'Authorization': 'Token ' + router.app.userAuth.token
        }
      })
      .then(
        function(response) {
          // vue's way to remove obj from array
          this.$parent.todos.$remove(todo);
        },
        function(response) {
          console.log(response);
        });
      }
    },
    editTodo: function(todo) {
      var todoAux = new newTodoObj(todo);
      this.$parent.$set('todo', todoAux);
      $('.ui.basic.modal').modal('show');
    },
    reverseTodo: function(todo) {
      todo.state = false;
      
      this.$http({
        url: appUrls.tasks + todo.id + '/', 
        method: 'PUT',
        headers: {
          'Authorization': 'Token ' + router.app.userAuth.token
        },
        data: {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          state: todo.state
        }
      })
      .then(
        function(response) {
          console.log(response);
          this.$parent.todo = new newTodoObj();
        },
        function(response) {
          console.log(response);
      });
    }
  }
});


var TodoComponent = Vue.extend({
  template: '#todo-template',
  ready: function() {
    $('.menu .item').tab();
  },
  components: {
    'todo-form-component': TodoFormComponent,
    'todo-list-component': TodoListComponent
  },
  data: function() {
    return {
      todos: router.app.userAuth.tasks,
      todo: new newTodoObj()
    }
  },
  route: {
    canActivate: function() {
      
      var token = localStorage.getItem('user_token');
      
      if (token.length > 0) {
        return true;
      } else {
        return false;
      }
      
    },
    activate: function() {
      
      var token = localStorage.getItem('user_token');
      var urlTaskByUser = appUrls.tasksByUser;
      var user = router.app.userAuth;
      
      this.$http({ 
          url: urlTaskByUser + token,
          method: 'GET',
          headers: {
            'Authorization': 'Token ' + token
          },
        })
        .then(function(response) {
            
          user.token = token;
          user.username = response.data.username;
          user.authenticated = true;
          user.tasks = response.data.tasks;
          
          this.todos = user.tasks;
          
        }, function(response) {
          console.log(response);
        });
    }
  },
  methods: {
    openModal: function() {
      $('.ui.basic.modal')
        .modal('setting', 'transition', 'vertical flip')
        .modal('show');
    }
  }
})

Vue.component('todo-component', TodoComponent);