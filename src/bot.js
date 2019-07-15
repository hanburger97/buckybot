const MessengerBot = require('src/api/fb/messenger.api.js');

const bot = new MessengerBot();

const MessageHandler = require('src/api/fb/handlers/message.handler.js');

init = () => {
  console.log('Bot initializing');
};

// registerHandlers = () => {
//     console.log('Start registrating handlers');
//     const msgHandler = new MessageHandler();
//     bot.on('message', (args) => {
//         msgHandler.handle(args)
//     })

// }

module.exports = bot;
