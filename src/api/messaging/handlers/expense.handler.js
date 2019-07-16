'use strict';
const BaseHandler = require('src/api/messaging/handlers/handler.js');

const ExpenseTracker = require('src/api/tracker/tracker.api.js');
const Templates = require('src/api/messaging/templates/message.template.js');
const ExpenseService = require('src/services/expense.service.js');

class ExpenseHandler extends BaseHandler {
    constructor() {
        super();
        this.tracker = new ExpenseTracker();
        this.targetPayload = [
            'ADD_EXPENSE',
            'VIEW_GROUP_EXPENSES'
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
                            title: 'View group expenses',
                            payload: 'VIEW_GROUP_EXPENSES'
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

    async listExpenses(userId, name, reply){
        let expenses = await ExpenseService.findByPayerId(userId);
        if (0 === expenses.length){
            reply(Templates.createText(`No expenses added by ${name}`));
        }
        for(let exp of expenses){
            await reply(Templates.createText(`${name} paid ${exp.amount}$ for ${exp.title}`));
        }

    }

    async handlePostBack({user, postback, reply}) {
        if ('ADD_EXPENSE' === postback){
            await reply(Templates.createText('Alrighty, so to add an expense simply type something like "@Bucky add an expense for 20$"'));
        }
        else if ('VIEW_GROUP_EXPENSES' === postback){
            await this.listExpenses(user.id, 'You', reply);
            const others = await this.getConversationUsers();
            for (let o of others){
                await this.listExpenses(o.externalId, o.name, reply);
            }
        }
    }
}

module.exports = ExpenseHandler;