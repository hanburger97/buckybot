const _ = require('lodash');


const ExpenseModel = require('src/models/expense.model.js');

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

  deleteExpense: (expenseId) => {
    return ExpenseModel.delete({
      where: {
        externalId: expenseId,
      },
    });
  },
};

module.exports = ExpenseService;
