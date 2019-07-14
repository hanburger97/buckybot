const MessengerBot = require('src/api/MessengerBot.js');

const bot = new MessengerBot();

const MessageHandler = require('src/api/handlers/MessageHandler.js');

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
