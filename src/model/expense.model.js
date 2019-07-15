'use strict';

const _ = require('lodash');

const DB = require('@xentreprise/cloud-db');

const ExpenseModel = DB.sequelize.define('Expenses', {
  id: {
    type: DB.Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },

  externalId: {
    type: DB.Sequelize.UUID,
    defaultValue: DB.Sequelize.UUIDV4,
    allowNull: false,
    unique: true,
  },

  // Owner of this expense, person who paid and is owed money
  payerId: {
    type: DB.Sequelize.UUID,
    allowNull: false,
  },

  amount: {
    type: DB.Sequelize.FLOAT,
    defaultValue: 0.0,
    allowNull: false,
  },

  currency: {
    type: DB.Sequelize.TEXT,
    defaultValue: 'CAD',
    allowNull: false,
  },

  title: {
    type: DB.Sequelize.TEXT,
  },

  description: {
    type: DB.Sequelize.TEXT,
  },

});


ExpenseModel.validFields = ['amount', 'currency', 'title', 'payerId', 'description'];

module.exports = ExpenseModel;
