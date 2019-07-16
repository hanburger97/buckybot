'use strict';
const BaseHandler = require('src/api/messaging/handlers/handler.js');

const ExpenseTracker = require('src/api/tracker/tracker.api.js');
const Templates = require('src/api/messaging/templates/message.template.js');

class ExpenseHandler extends BaseHandler {
    constructor() {
        super();
        this.tracker = new ExpenseTracker();
        this.targetPayload = [
            'ADD_EXPENSE'
        ];
    }

    canHandle({text, payload, nlp}){
        
        if (text && ""!==text) {
            if (this.isAddressedToBucky(text)){
                if (nlp && nlp.entities && nlp.entities.amount_of_money){
                    return true;
                }
            }
        }
        else if (payload){
            return this.targetPayload.includes(payload);
        }
        return false;
    }

    async handle({user, payload, reply}) {
        return new Promise( async (resolve, reject) => {
            try{
                const exp = await this.tracker.createNewExpense(
                    `foobar${Math.floor(Math.random() * 10)}`, parseFloat(payload.value), user
                );
    
                await reply(Templates.createText(`Cool cool cool! I added a new expense ${exp.title} for ${exp.amount}$`));
                
                let users = await this.getConversationUsers();
                let userIds = users.map(x => {return x.externalId});
                await this.tracker.addPeopleToExpense(exp.id, userIds);

                await reply(Templates.createQuickReplies(
                    `I updated everyone's total for the new expense`, [
                        {
                            title: 'Check my tab',
                            payload: 'CHECK_MY_STATUS'
                        },
                        {
                            title: 'View tab summary',
                            payload: 'SUMMARY'
                        }
                    ]
                ));

                resolve();
            }
            catch(err){
                reject(err);
            }
            
        })
    }

    handlePostBack({user, postback, reply}) {
        return reply(Templates.createText('To add an expense simply type something like "add an expense of 20$"'));
    }
}

module.exports = ExpenseHandler;