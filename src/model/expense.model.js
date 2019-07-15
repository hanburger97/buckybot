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

  title: {
    type: DB.Sequelize.TEXT,
    allowNull: false
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

  description: {
    type: DB.Sequelize.TEXT,
  },

},{
  validate: {
    externalIdImmutable: function() {
      if (this.changed('externalId')) {
        throw new Error('`externalId` cannot be changed after expense creation.');
      }
    }
  },
  paranoid: false,
});


ExpenseModel.prototype.toJSON = function(unsafe = false) {
  if (unsafe === true) {
    return _.clone(this.get({plain: true}));
  }
  const self = this;
  const json = [
    'title', 'payerId', 'amount',
    'currency', 'description',
  ]
      .map((key) => {
        return [key, self.get(key)];
      })
      .filter(([field, value]) => {
        return !!value;
      })
      .reduce((acc, [key, value]) => {
        return {...acc, [key]: value};
      }, {});

  json.id = this.get('externalId');
  return json;
};

ExpenseModel.validFields = ['amount', 'currency', 'title', 'payerId', 'description'];

module.exports = ExpenseModel;
