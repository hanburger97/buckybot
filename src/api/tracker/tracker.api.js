'use strict';
const _ = require('lodash');
const UserService = require('src/services/user.service.js');
const ExpenseService = require('src/services/expense.service.js');

class ExpenseTracker {
  /**
     * Creates a new Expense
     * @param {string} title
     * @param {float} amount
     * @param {object} owner
     * @param {string} description
     * @return Expense JSON object
     */
  async createNewExpense(title, amount, owner, description='') {
    let expense_owner;
    if (owner.psid) {
      expense_owner = await UserService.getUserByPSID(owner.psid);
    } else if (owner.id) {
      expense_owner = await UserService.getUserById(owner.id);
    }
    const expenseObject = {
      title,
      amount,
      description,
      payerId: expense_owner.externalId,
    };
    const expense = await ExpenseService.createExpense(expenseObject);
    return expense.toJSON();
  }

  /**
   * Attach people to an existing expense
   * @param {UUID} expenseId 
   * @param {list<object<UUID>>} people 
   */
  async addPeopleToExpense(expenseId, people){
    let users = await UserService.getManyById(people);
    let expense = await ExpenseService.getById(expenseId);
    await expense.addUsers(users);
  }

  /**
     * Aggregates all the amount the owner is owed and all the people owing
     * @param {UUID} ownerId
     * @returns {map<userId, object<total, list<>>>>}
     */
  async getAmountOwed(ownerId) {
    const owedExpenses = await ExpenseService.findByPayerId(ownerId);
    let debtors = [];
    for (let expense of owedExpenses) {
      let users = await expense.getUsers();
      let user_size = users.length + 1;
      // Note the +1 includes the equal splitting including owner of this expense

      users = _.map(users, (usr) => {
        let res = usr.toJSON();
        // Aggregate by expense
        res.amount_owed = (expense.amount / user_size);
        res.expense_ref = expense.externalId;
        return res;
      });
      
      debtors.push(...users);
    }
    // Need to aggregate by each user. using a map
    let res = {}
    for(let x of debtors){
      if (undefined !== res[x.id] && null !== res[x.id]){
        res[x.id]['total'] = res[x.id]['total']+ x.amount_owed;
        res[x.id]['expenses'].push(x.expense_ref) ;
      }
      else {
        res[x.id] = {
          total: x.amount_owed,
          name: x.name,
          expenses: [
            x.expense_ref
          ]
        }
      }
    }
    return res;
  }


  /**
     * Aggregates all the amount that is owed to each person by the owner
     * @param {UUID} debtorId
     * @returns {list<object<...user, amount>>}
     */
  async getDebts(debtorId) {
    const debtor = await UserService.getUserById(debtorId);
    let expenses = await debtor.getExpenses();

    let exps = []
    for (let exp of expenses){
      let others = await exp.getUsers();
      const share_size = others.length + 1;
      let res = exp.toJSON();
      res.amount = res.amount / share_size;
      exps.push(res);
    }
    const debts = _(exps)
        .groupBy('payerId')
        .map((objs, key) => ({
          expenses_ref: objs.map(x => x.id),
          payerId: key,
          total: _.sumBy(objs, 'amount'),
        }))
        .value();
    return debts;
  }

  async clearDebts(ownerId, debtorId){
    const debtor = await UserService.getUserById(debtorId);
    let expenses = await debtor.getExpenses();
    expenses = _(expenses).filter(exp => {return exp.payerId === ownerId});
    for (let exp of expenses){
        let others = await exp.getUsers();
        const share_size = others.length + 1;
        await exp.removeUser(debtor);
        await ExpenseService.updateExpense(exp.externalId, {
          amount: exp.amount * (1 - 1/share_size)
        })
    }
  }

}

module.exports = ExpenseTracker;
