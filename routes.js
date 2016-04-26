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
  
  /**
   * FB Bot Messenger Test
   */
  app.get('/webhook/', function(req, res) {
    if (req.query['hub.verify_token'] === 'my_token_test_ltry') {
      res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
  });
};

module.exports = routesGlobal;