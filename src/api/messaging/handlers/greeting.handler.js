const BaseHandler = require('src/api/messaging/handlers/handler.js');

const Templates = require('src/api/messaging/templates/message.template.js');
const config = require('src/util/config.js');

class GreetingsHandler extends BaseHandler {
    constructor() {
        super()
    }

    canHandle(text, nlp){
        if (this.isAddressedToBucky(text)){
            if (nlp && nlp.entities && nlp.entities.greetings){
                return true;
            }
        }
        return false;
    }
    
    async handle({user, payload, reply}) {
        
        if (config.get('demo_mode')){
            await reply(Templates.createText('DEMO/DEV MODE: conversation configured to assume a group chat of 3 people: Alice, Bob and you'))
        }

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
        await reply(tmpl);
    }
}

module.exports = GreetingsHandler;