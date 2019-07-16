const MessengerBot = require('src/api/fb/messenger.api.js');

const bot = new MessengerBot();

const MessageObserver = require('src/api/fb/observers/message.observer.js');
const PostbackObserver = require('src/api/fb/observers/postback.observer.js');
const QuickReplyObserver = require('src/api/fb/observers/quick.reply.observer.js');

const observers = {
  message: new MessageObserver(),
  postback: new PostbackObserver(),
  quick_reply: new QuickReplyObserver()
}

registerObservers = () => {
    const observers_keys = Object.keys(observers);
    for (let key of observers_keys){
      bot.on(key, (args) => {
        observers[key].handle(args);
      });
      console.log(`Observer for ${key} events: registered`);
    }
}

module.exports = {
  bot,
  registerObservers
}
