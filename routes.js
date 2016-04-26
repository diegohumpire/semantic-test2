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
  
  app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging;
    for (i = 0; i < messaging_events.length; i++) {
      event = req.body.entry[0].messaging[i];
      sender = event.sender.id;
      if (event.message && event.message.text) {
        text = event.message.text;
        // Handle a text message from this sender
      }
    }
    res.sendStatus(200);
  });
  
};

module.exports = routesGlobal;