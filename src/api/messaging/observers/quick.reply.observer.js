'use strict';
const BaseObserver = require('src/api/messaging/observers/observer.js');

const ExpenseHandler = require('src/api/messaging/handlers/expense.handler.js');
const SummaryHandler = require('src/api/messaging/handlers/summary.handler.js');

class QuickReplyObserver extends BaseObserver{
    constructor() {
        super();
        this.handlers = {
          expense: new ExpenseHandler(),
          summary: new SummaryHandler()
        }
    }

    async handle(args){
        const user = await this.fixUser(args);
        const payload = args.payload.message.quick_reply.payload;
        try{
          if(this.handlers.expense.canHandle({payload})){
              await this.handlers.expense.handlePostBack({
                user, postback:payload, reply:args.reply
              })
          }
          if (this.handlers.summary.canHandle({payload})){
            await this.handlers.summary.handle({
              user,
              payload,
              reply:args.reply
            });
          }
        }
        catch(err){
          console.log(err);
        }
    }
}
module.exports = QuickReplyObserver;