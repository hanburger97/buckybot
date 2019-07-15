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
  async AddPeopleToExpense(expenseId, people){
    let users = await UserService.getManyById(people);
    let expense = await ExpenseService.getById(expenseId);
    await expense.addUsers(users);
  }

  /**
     * Aggregates all the amount the owner is owed and all the people owing
     * @param {UUID} ownerId
     * @returns {list<object<...user, amount>>}
     */
  async getAmountOwed(ownerId) {
    const owedExpenses = await ExpenseService.findByPayerId(ownerId);
    let debtors;
    for (let expense of owedExpenses) {
      let users = await expense.getUsers();
      users = _.map(users, (usr) => {
        return usr.toJSON();
      });
      debtors+= users;
    }
    debtors = _(debtors)
        .groupBy('id')
        .map((objs, key) => ({
          'id': key,
          'psid': objs.psid || null,
          'name': objs.name,
          'amount': _.sumBy(objs, 'amount'),
        }))
        .value();
    return debtors;
  }


  /**
     * Aggregates all the amount that is owed to each person by the owner
     * @param {UUID} debtorId
     * @returns {list<object<...user, amount>>}
     */
  async getDebts(debtorId) {
    const debtor = await UserService.getUserById(debtorId);
    let expenses = await debtor.getExpenses();
    expenses = _(expenses).map((exp) => {
      return exp.toJSON();
    });
    const debts = _(expenses)
        .groupBy('payerId')
        .map((objs, key) => ({
          payerId: key,
          amount: _.sumBy(objs, 'amount'),
        }))
        .value();
    return debts;
  }

  async clearDebts(ownerId, debtorId){
    const debtor = await UserService.getUserById(debtorId);
    let expenses = await debtor.getExpenses();
    expenses = _(expenses).filter(exp => {return exp.payerId === ownerId});
    for (let exp of expenses){
        await exp.removeUser(debtor);
    }
  }

}

module.exports = ExpenseTracker;
