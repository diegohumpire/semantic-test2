var routesGlobal = function(app) {
  
  var home = require('./controllers/home');
  var user = require('./controllers/user');
  
  /* GET home page. */
  app.get('/', home.index);
  
  /* GET users listing. */
  app.get('/users', user.index);
  
  app.get('/pub', function(req, res) {
    console.log('got the get!');    
  });
};

module.exports = routesGlobal;