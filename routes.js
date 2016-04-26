var winston = require('winston');
var request = require('request');
var token = "EAAWv3GcO0moBANpu6ZB2vC3zDiyb6Qyi8CY5ulw09vFFueBsW7nkkUQOBXqXId0ewFW2UGhgGtv0ZCMz2WRyFEMFvpeSvVoqYQwRKLVlHOGZCC0OvscA8jI362SSHHkkgh2ZBSdDBP7uYXKdLwr08F8EcCRQss2pc3wKuZCKzGAZDZD";

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
        try {
          messageData = {
            text: "Text received, echo: "+ text.substring(0, 200)
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
              winston.log('info', 'Error sending message: ' + error);
            } else if (response.body.error) {
              winston.log('info', 'Error: ' + response.body.error);
            }
          });
        }
        catch (e) {
          winston.log('info', e);
        }
      }
    }
    res.sendStatus(200);
  });
  
};

module.exports = routesGlobal;