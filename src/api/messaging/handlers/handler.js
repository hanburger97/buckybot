'use strict';
const Template = require('src/api/messaging/templates/message.template.js');

class BaseHandler{

    constructor(){
        
    }

    isAddressedToBucky(text){
        const r = /(.*)@bucky|@Bucky(.*)/
        let m = text.match(r);
        return !!m;
    }

    async handle({user, reply}){
        reply(Template.createQuickReplies(`I'm sorry ${user.firstName || user.name}, I did not understand your request, please try again`, [
            {
                title: 'Add an expense',
                payload: 'ADD_EXPENSE'
            },
            {
                title: 'View tab summary',
                payload: 'SUMMARY'
            }
        ]))
    }

}

module.exports = BaseHandler;