var todos = [
  { task: 'Task #1', state: false, text: 'Descripcion de la Tarea' },
  { task: 'Task #2', state: false, text: 'Descripcion de la Tarea' },
  { task: 'Task #3', state: true, text: 'Descripcion de la Tarea' },
  { task: 'Task #4', state: false, text: 'Descripcion de la Tarea' }
];

new Vue({
  el: '#app',
  data: {
    todos: todos
  }
});
