'use strict';
const Handler = require('src/api/fb/handlers/handler.js');

class MessageHandler extends Handler {
  handle(args) {
    console.log(JSON.stringify(args));
  }
}

module.exports = MessageHandler;
