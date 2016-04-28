var winston = require('winston');
var request = require('request');
var format = require('string-format');
var fb_utils = require('../fb_utils/message');
var token = "EAAWv3GcO0moBANpu6ZB2vC3zDiyb6Qyi8CY5ulw09vFFueBsW7nkkUQOBXqXId0ewFW2UGhgGtv0ZCMz2WRyFEMFvpeSvVoqYQwRKLVlHOGZCC0OvscA8jI362SSHHkkgh2ZBSdDBP7uYXKdLwr08F8EcCRQss2pc3wKuZCKzGAZDZD";


// Public Actions
exports.webhook = function (req, res) {
  
  var cmd_text_init = 'cmd@';
  var messaging_events = req.body.entry[0].messaging;
  
  for (i = 0; i < messaging_events.length; i++) {
    
    // Entry FB
    var event = req.body.entry[0].messaging[i];
    
    // ID de FB Chat
    var sender = event.sender.id; 
    
    // Message Event
    if (event.message && event.message.text) {
      
      // Chat Text
      var text = String(event.message.text);
      
      try {
        
        if (text.indexOf(cmd_text_init) > -1) {
          
          var cmd_text = text.replace(cmd_text_init, '');
          
          if (cmd_text.indexOf(':') == -1) {
            fb_utils.sendSimpleMessage(sender, 'Por favor ingrese los parametros adecuados');
            continue;
          } 
          
          var cmd_specific = cmd_text.substring(0, cmd_text.indexOf(':'));
          // Ej: auth:dhumpire@dhumpire
          // fb_utils.sendSimpleMessage(sender, format('Se ha enviado un comando - completo "{0}"', cmd_text), token);
          // Ej: auth
          // fb_utils.sendSimpleMessage(sender, format('Se ha enviado un comando - especifico "{0}"', cmd_specific), token);
          
          if (cmd_specific === 'auth') {
            
            var auth_str = cmd_text.substring(cmd_text.indexOf(':') + 1, cmd_text.length);
            var username = auth_str.substring(0, auth_str.indexOf('@'));
            var password = auth_str.substring(auth_str.indexOf('@') + 1, auth_str.length);
            var user_information = {};
            
            // fb_utils.sendSimpleMessage(sender, format('username: {0} password: {1}', username, password));
            
            request({ 
              url: 'https://todo-backend-dj.herokuapp.com/api/v2/api-auth/tokenizer/', 
              method: 'POST', 
              json: { 
                username: username, 
                password: password 
              } 
            }, 
            function(error, response, body) { 
              user_information = body;
              fb_utils.sendMessage(sender, user_information.user.tasks, token);
            });
            continue;
          }
          
          continue;
        }
        
        if (text === 'Generic') {
          fb_utils.sendGenericMessage(sender, token);
          continue;
        }
        
        fb_utils.sendSimpleMessage(sender, text, token);
        
      }
      catch (e) {
        winston.log('info', e);
      }
    }
    
    // Postback Event
    if (event.postback) {
      text = JSON.stringify(event.postback);
      winston.log('info', text);
      fb_utils.sendGenericMessage(sender, token);
      continue;
    }
  }
  res.sendStatus(200);
}