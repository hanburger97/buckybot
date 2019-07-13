'use strict';
const Handler = require('src/api/handlers/Handler.js');

class MessageHandler extends Handler {

    handle(args) {

        console.log(JSON.stringify(args));
        
    }
}

module.exports = MessageHandler;