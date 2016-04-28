var winston = require('winston');
var request = require('request');
var format = require('string-format');

/**
 * FB Messenger Platform just admit 3 buttons per message
 */
var parserButtons = function(data, type_button) {
  
  var type_button = type_button || 'postback';
  var arrayData = [];
  
  try {
    
    for(var index in data) {
      // Max 3 buttons
      if (index != 3) {
        var task = data[index];
        var buttonTemplate = {
          'type': type_button,
          'title': task.description,
          'payload': task.id
        }
        arrayData.push(buttonTemplate);
      }
    }
    
    winston.log('info', 'parserButtons: ' + arrayData.length);
    
    return arrayData;
    
  } catch(e) {
    winston.log('info', 'parserButtons: ' + e);
  }
};


var createButtonMessageData = function(data) {
  
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


exports.sendMessage = function(sender, messageData, token) {
  
  var messageData = createButtonMessageData(messageData);
  
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { 
      access_token: token 
    },
    method: 'POST',
    json: {
      recipient: { 
        id: sender 
      },
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      winston.log('info', 'Error sending message: ' + error);
    } else if (response.body.error) {
      winston.log('info', 'Error - Here!! : ' + response.body.error);
      var keys = Object.keys(response.body.error);
      winston.log('info', 'Error - Here!! : ' + keys);
      winston.log('info', 'Error - Here!! : ' + response.body.error.message);
      winston.log('info', 'Error - Here!! : ' + response.body.error.type);
      winston.log('info', 'Error - Here!! : ' + response.body.error.code);
      winston.log('info', 'Error - Here!! : ' + response.body.error.fbtrace_id);
    }
  });
};


exports.sendSimpleMessage = function(sender, text, token) {
  
  var messageData = {
    text: text
  }
  
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { 
      access_token: token 
    },
    method: 'POST',
    json: {
      recipient: { 
        id: sender 
      },
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      winston.log('info', 'Error sending message: ' + error);
    } else if (response.body.error) {
      winston.log('info', 'Error - sendSimpleMessage!! : ' + response.body.error.message);
      winston.log('info', 'Error - sendSimpleMessage!! : ' + response.body.error.type);
      winston.log('info', 'Error - sendSimpleMessage!! : ' + response.body.error.code);
      winston.log('info', 'Error - sendSimpleMessage!! : ' + response.body.error.fbtrace_id);
    }
  });
  
}


exports.sendGenericMessage = function(sender, token) {
  
  var messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "First card",
            "subtitle": "Element #1 of an hscroll",
            "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
            "buttons": [
              {
                "type": "web_url",
                "url": "https://www.messenger.com/",
                "title": "Web url"
              },{
                "type": "postback",
                "title": "Postback",
                "payload": "Payload for first element in a generic bubble",
              }
            ],
         },{
            "title": "Second card",
            "subtitle": "Element #2 of an hscroll",
            "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
            "buttons": [
              {
                "type": "web_url",
                "url": "https://www.messenger.com/",
                "title": "Web url"
              },{
              "type": "postback",
              "title": "Postback",
              "payload": "Payload for second element in a generic bubble",
              }
            ]
        },{
            "title": "Second card",
            "subtitle": "Element #2 of an hscroll",
            "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
            "buttons": [
              {
                "type": "postback",
                "title": "Postback",
                "payload": "Payload for third element in a generic bubble"
              }
            ]
        },{
            "title": "Second card",
            "subtitle": "Element #2 of an hscroll",
            "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
            "buttons": [{
              "type": "postback",
              "title": "Postback",
              "payload": "Payload for third element in a generic bubble"
            }]
        }]
      }
    }
  };
  
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { 
      access_token: token 
    },
    method: 'POST',
    json: {
      recipient: { 
        id: sender 
      },
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      winston.log('info', 'Error sending message: ' + error);
    } else if (response.body.error) {
      winston.log('info', 'Error - Here!! : ' + response.body.error.message);
      winston.log('info', 'Error - Here!! : ' + response.body.error.type);
      winston.log('info', 'Error - Here!! : ' + response.body.error.code);
      winston.log('info', 'Error - Here!! : ' + response.body.error.fbtrace_id);
    }
  });
}