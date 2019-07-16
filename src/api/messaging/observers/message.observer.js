'use strict';
const BaseObserver = require('src/api/messaging/observers/observer.js');

const BaseHandler = require('src/api/messaging/handlers/handler.js');
const GreetingsHandler = require('src/api/messaging/handlers/greeting.handler.js');
const ExpenseHandler = require('src/api/messaging/handlers/expense.handler.js');

class MessageObserver extends BaseObserver {

  constructor(){
    super();
    this.handlers = {
      greeting: new GreetingsHandler(),
      expense: new ExpenseHandler(),
      base: new BaseHandler()
    }
  }

  async handle(args) {
    console.log(JSON.stringify(args));
    // Fetch the current user
    const user = await this.fixUser(args);
    const textMessage = args.payload.message.text;
    const nlp = args.payload.message.nlp;

    let handled = false;

    try{
      if (this.handlers.greeting.canHandle(textMessage, nlp)){
        await this.handlers.greeting.handle({user, payload:{textMessage}, reply: args.reply});
        handled = true
      }
      
      if (this.handlers.expense.canHandle({text: textMessage, payload: null, nlp})){
        await this.handlers.expense.handle({
          user, 
          payload: {
            textMessage, 
            value: nlp.entities.amount_of_money[0].value
          }, 
          reply:args.reply
        });
        handled = true
      }

      if (!handled &&this.handlers.base.canHandle({text: textMessage})){
        this.handlers.base.handle({user, reply:args.reply});
      }
      
    }
    catch(err) {
      console.log(err);

    }
    
  }
}

module.exports = MessageObserver;
