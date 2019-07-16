'use strict';
const BaseHandler = require('src/api/messaging/handlers/handler.js');

const ExpenseTracker = require('src/api/tracker/tracker.api.js');
const Templates = require('src/api/messaging/templates/message.template.js');

class SummaryHandler extends BaseHandler {
    constructor(){
        super();
        this.tracker = new ExpenseTracker();
        this.targetPayload = [
            'SUMMARY'
        ]
    }

    canHandle({text, payload}){
        if (payload){
            return this.targetPayload.includes(payload); 
        }
        return false;
    }

    async handle({user, payload, reply}){
        // start with main user
        let res = await this.tracker.getSummary(user.id);
        for (let name of Object.keys(res)){
            let str = res[name] > 0 ? `${name} owes you ${res[name]}$` : `you owe ${name} ${-1 * res[name]}$`; 
            await reply(Templates.createText(str));
        }
    }
}

module.exports = SummaryHandler;