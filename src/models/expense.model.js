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

ExpenseModel.validFields = ['amount', 'currency', 'title', 'description'];

module.exports = ExpenseModel;
