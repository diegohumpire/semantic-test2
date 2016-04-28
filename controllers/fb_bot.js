var winston = require('winston');
var request = require('request');
var format = require('string-format');
var token = "EAAWv3GcO0moBANpu6ZB2vC3zDiyb6Qyi8CY5ulw09vFFueBsW7nkkUQOBXqXId0ewFW2UGhgGtv0ZCMz2WRyFEMFvpeSvVoqYQwRKLVlHOGZCC0OvscA8jI362SSHHkkgh2ZBSdDBP7uYXKdLwr08F8EcCRQss2pc3wKuZCKzGAZDZD";


var parserButtons = function(data) {
  
  var arrayData = [];
  
  try {
    
    for(var index in data) { 
      var task = data[index];
      var buttonTemplate = {
        'type': 'postback',
        'title': task.description,
        'payload': "user_defined_payload"
      }
      arrayData.push(buttonTemplate);
    }
    
    return arrayData;
    
  } catch(e) {
    winston.log('info', 'parserButtons: ' + e);
  }
};


var createMessageData = function(data) {
  
  var messageData = {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'button',
        'text': 'Que tarea deseas visualizar?',
        'buttons': parserButtons(data)
      }
    }
  }
  
  return messageData;
};


var sendMessage = function(sender, messageData) {
  
  var messageData = createMessageData(messageData);
  
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token:token },
    method: 'POST',
    json: {
      recipient: { id:sender },
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      winston.log('info', 'Error sending message: ' + error);
    } else if (response.body.error) {
      winston.log('info', 'Error - Here!! : ' + response.body.error);
    }
  });
};


var sendGenericMessage = function(sender) {
  
  var messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "First card",
          "subtitle": "Element #1 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.messenger.com/",
            "title": "Web url"
          }, {
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for first element in a generic bubble",
          }],
        },{
          "title": "Second card",
          "subtitle": "Element #2 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
          "buttons": [{
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for second element in a generic bubble",
          }],
        }]
      }
    }
  };
  
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token:token },
    method: 'POST',
    json: {
      recipient: { id:sender },
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

var sendSimpleMessage = function(sender, text) {
  
  var messageData = {
    text: text
  }
  
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token:token },
    method: 'POST',
    json: {
      recipient: { id:sender },
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


// Public Actions
exports.webhook = function (req, res) {
  
  var cmd_text_init = 'cmd@';
  var messaging_events = req.body.entry[0].messaging;
  
  for (i = 0; i < messaging_events.length; i++) {
    
    // Entrada de FB
    var event = req.body.entry[0].messaging[i];
    
    // ID de FB de la persona con quien se esta conversado por chat
    var sender = event.sender.id; 
    
    // winston.log('info', event);
    // winston.log('info', event.sender);
    
    if (event.message && event.message.text) {
      
      // Texto del chat
      var text = String(event.message.text);
      // winston.log('info', text);
      
      try {
        
        if (text.indexOf(cmd_text_init) > -1) {
          
          var cmd_text = text.replace(cmd_text_init, '');
          
          if (cmd_text.indexOf(':') == -1) {
            sendSimpleMessage(sender, 'Por favor ingrese los parametros adecuados');
            continue;
          } 
          
          var cmd_specific = cmd_text.substring(0, cmd_text.indexOf(':'));
          
          // Ej: auth:dhumpire@dhumpire
          // sendSimpleMessage(sender, format('Se ha enviado un comando - completo "{0}"', cmd_text));
          
          // Ej: auth
          // sendSimpleMessage(sender, format('Se ha enviado un comando - especifico "{0}"', cmd_specific));
          
          if (cmd_specific === 'auth') {
            
            var auth_str = cmd_text.substring(cmd_text.indexOf(':') + 1, cmd_text.length);
            var username = auth_str.substring(0, auth_str.indexOf('@'));
            var password = auth_str.substring(auth_str.indexOf('@') + 1, auth_str.length);
            var user_information = {};
            
            // sendSimpleMessage(sender, format('username: {0} password: {1}', username, password));
            request({ 
              url: 'https://todo-backend-dj.herokuapp.com/api/v2/api-auth/tokenizer/', 
              method: 'POST', 
              json: { 
                username: username, 
                password: password 
              } 
            }, 
            function(error, response, body) { 
              // winston.log('info', body);
              user_information = body;
              sendMessage(sender, user_information.user.tasks);
            });
            continue;
          }
          
          continue;
        }
        
        if (text === 'Generic') {
          sendGenericMessage(sender);
          continue;
        }
        
        sendSimpleMessage(sender, text);
        
      }
      catch (e) {
        winston.log('info', e);
      }
    }
    
    if (event.postback) {
      text = JSON.stringify(event.postback);
      winston.log('info', text);
      sendGenericMessage(sender);
      continue;
    }
  }
  res.sendStatus(200);
}