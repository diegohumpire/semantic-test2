var winston = require('winston');
var token = "EAAWv3GcO0moBAG6JYR47hFmO983abt9E20pFcdjze1LVjswvIpZBwWb3eb6uwX9DvRFjq03ZByhNo09qjKaJ5E7EsmuTyN4ATGajhMrGA55jgW8MY3dyQ2OVl2QhZA2Y1wx15PTxNZBrZAHp7laHxa8wl7EdRPty41OpZCBOqHCwZDZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      winston.log('error', 'Error sending message: ' + error);
    } else if (response.body.error) {
      winston.log('error', 'Error: ' + response.body.error);
    }
  });
}

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
        winston.log('info', text);
        sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
      }
    }
    res.sendStatus(200);
  });
  
};

module.exports = routesGlobal;