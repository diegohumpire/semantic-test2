// Todo Constructor
var newTodoObj = function(props) {

  // New object
  var todo = props || {};

  this.id = todo.id || 0;
  this.title = todo.title || '';
  this.state = todo.state || false;
  this.description = todo.description || '';
};


// User Auth
var UserAuth = function(props) {

  // New object
  var user = props || {};

  this.id = user.id || 0;
  this.username = user.username || '';
  this.token = user.token || '';
  this.authenticated = user.authenticated || false;
  this.tasks = [];
};

var appUrls = {
  tokenizer: 'https://todo-backend-dj.herokuapp.com/api/v2/api-auth/tokenizer/',
  tasks: 'https://todo-backend-dj.herokuapp.com/api/v2/tasks/',
  tasksByUser: 'https://todo-backend-dj.herokuapp.com/api/v2/users/tasks/'
}