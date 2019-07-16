'use strict';
const Template = require('src/api/messaging/templates/message.template.js');
const config = require('src/util/config.js');

const demoUtils = require('src/util/demo.js');
class BaseHandler{

    constructor(){
        
    }

    isAddressedToBucky(text){
        const r = /(.*)@bucky|@Bucky(.*)/
        let m = text.match(r);
        return !!m;
    }

    getConversationUsers(){
        if (config.get('demo_mode')){
            return demoUtils.getDummyUsers();
        }
    }

    canHandle({text}){
        return this.isAddressedToBucky(text);
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