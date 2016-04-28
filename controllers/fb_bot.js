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
              tasks = user_information.user.tasks.filter(function (obj) {
                return obj.state == false;
              });
              fb_utils.sendMessage(sender, tasks, token);
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
      var postback = event.postback;
      winston.log('info', postback);
      winston.log('info', typeof(postback));
      var payload = postback.payload;
      winston.log('info', payload);
      var task_id = payload.substring(payload.indexOf('-') + 1, payload.length);
      winston.log('info', 'Task ID: ' + task_id);
      
      request({ 
        url: 'http://todo-backend-dj.herokuapp.com/api/v2/tasks/' + task_id + '/', 
        method: 'PUT', 
        json: { 
          state: true
        },
        headers: {
          'Authorization': 'Token f7e7cd9e49824c1b1557c4d60179f5032ce5c4b4'
        }
      }, 
      function(error, response, body) { 
        winston.log('info', body);
        if (error) {
          winston.log('info', 'Error: ' + error);
        } else {
          task = body;
          text_response = format('La siguiente tarea "{0} - {1}" ha sido marcada como hecho. Felicidades!', body.title, body.description);
          fb_utils.sendSimpleMessage(sender, text_response, token);  
        }
      });
      
      continue;
    }
  }
  res.sendStatus(200);
}