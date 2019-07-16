'use strict';
const BaseObserver = require('src/api/messaging/observers/observer.js');

const ExpenseHandler = require('src/api/messaging/handlers/expense.handler.js');

class QuickReplyObserver extends BaseObserver{
    constructor() {
        super();
        this.handlers = {
          expense: new ExpenseHandler()
        }
    }

    async handle(args){
        const user = await this.fixUser(args);
        const payload = args.payload.message.quick_reply.payload;


        try{
          if(this.handlers.expense.canHandle("", payload)){
              await this.handlers.expense.handlePostBack({
                user, postback:payload, reply:args.reply
              })
          }
          else {
            
          }
        }
        catch(err){
          console.log(err);
        }
    }
}
module.exports = QuickReplyObserver;