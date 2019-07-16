const BaseHandler = require('src/api/messaging/handlers/handler.js');

const Templates = require('src/api/messaging/templates/message.template.js');

class GreetingsHandler extends BaseHandler {
    constructor() {
        super()
    }

    
    handle({user, payload, reply}) {
        
        let tmpl = Templates.createQuickReplies(
            `Greetings ${user.firstName}, welcome to Bucky, an expense tracker for group plans`,
            [
                {
                    title: 'Add an expense',
                    payload: 'ADD_EXPENSE'
                },
                {
                    title: 'Get status',
                    payload: 'GET_TRACKING_STATUS'
                }
            ]
        );
        return reply(tmpl);
    }
}

module.exports = GreetingsHandler;