const _ = require('lodash');

const DB = require('@xentreprise/cloud-db');

const UserModel = require('src/model/user.model.js');
const ExpenseModel = require('src/model/expense.model.js');


// We are defining a join table used for the Many-Many association
//  of User and Expenses
const UserExpenseModel = DB.sequelize.define('UsersExpenses', {
  id: {
    type: DB.Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: DB.Sequelize.BIGINT,
    references: 'Users',
    referencesKey: 'id',
    allowNull: false,
  },

  expenseId: {
    type: DB.Sequelize.BIGINT,
    references: 'Expenses',
    referencesKey: 'id',
    allowNull: false,
  },


}, {
  paranoid: false,
});


// Definint a many to many association for Users and Expenses
UserModel.belongsToMany(ExpenseModel, {
  onDelete: 'CASCADE',
  through: {
    model: UserExpenseModel,
  },
  foreignKey: 'userId',
});

ExpenseModel.belongsToMany(UserModel, {
  onDelete: 'CASCADE',
  through: {
    model: UserExpenseModel,
  },
  foreignKey: 'expenseId',
});

module.exports = UserExpenseModel;
