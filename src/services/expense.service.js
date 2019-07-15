const _ = require('lodash');


const ExpenseModel = require('src/models/expense.model.js');
const UserModel = require('src/model/user.model.js');

const ExpenseService = {

  createExpense: (expenseData) => {
    const filteredData = _.pick(expenseData, ExpenseModel.validFields);
    return ExpenseModel.create(filteredData);
  },

  updateExpense: (expenseId, data) => {
    const filteredData = _.pick(data, ExpenseModel.validFields);
    return ExpenseModel.update({
      where: {
        externalId: expenseId,
      },
      filteredData,
    });
  },

  getById: (expenseId) => {
    return ExpenseModel.findOne({
        where: {
            externalId: expenseId
        }
    });
  },

  findByPayerId: (payerId) => {
    return ExpenseModel.findAll({
      where: {
        payerId,
      },
    });
  },

  deleteExpense: (expenseId) => {
    return ExpenseModel.delete({
      where: {
        externalId: expenseId,
      },
    });
  },


};

module.exports = ExpenseService;
