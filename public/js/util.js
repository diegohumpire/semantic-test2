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
