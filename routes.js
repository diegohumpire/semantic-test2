var token = "EAAWv3GcO0moBAJ7MUGKIchQDr1ZCi1bZCOTyZAmOHBVidzNXxeWaic7ULLkeLZASq0C5YMlyqCVVcQaU63fqKAIv6dqYoP3iLzu9hut2kbV8eZBAXEVOoFQZBfrYQcw8ISkEY7NmA1LXpOCnAj88yj9kAhxwyZBq8iZCjE9nhonRhgZDZD";

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
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
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
        sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
      }
    }
    res.sendStatus(200);
  });
  
};

module.exports = routesGlobal;