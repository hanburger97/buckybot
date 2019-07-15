'use strict';

const _ = require('lodash');
const uuid = require('uuid');
const uuidValidate = require('uuid-validate');


const DB = require('@xentreprise/cloud-db/db.js');

const UserModel = DB.sequelize.define('Users', {
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

  email: {
    type: DB.Sequelize.TEXT,
    allowNull: false,
    unique: true,
    set: function(val) {
      this.setDataValue('email', UserModel.cleanEmail(val));
    },
  },

  FBasid: {
    type: DB.Sequelize.TEXT
  },

  FBpsid: {
    type: DB.Sequelize.TEXT
  },

  firstName: {
    type: DB.Sequelize.TEXT,
    set: function(val) {
      this.setDataValue('firstName', UserModel.cleanName(val));
    },
    get: function() {
      const name = this.getDataValue('name');
      const firstName = this.getDataValue('firstName');
      const lastName = this.getDataValue('lastName');
      if (firstName) {
        return firstName;
      }
      if (name && lastName && name.endsWith(lastName)) {
        return name.slice(0, -lastName.length).trim();
      }
      if (name) {
        return name.split(' ').shift();
      }
      return null;
    },
  },

  lastName: {
    type: DB.Sequelize.TEXT,
    set: function(val) {
      this.setDataValue('lastName', UserModel.cleanName(val));
    },
    get: function() {
      const name = this.getDataValue('name');
      const firstName = this.getDataValue('firstName');
      const lastName = this.getDataValue('lastName');
      if (lastName) {
        return lastName;
      }
      if (name && firstName && name.startsWith(firstName)) {
        return name.slice(firstName.length).trim();
      }
      if (name) {
        // Use array deconstruction to split the name.
        // Discard the first word, and keep the rest.
        const [_firstName, ...rest] = name.split(' ');
        return rest.join(' ');
      }
      return null;
    },
  },

  name: {
    type: DB.Sequelize.TEXT,
    set: function(val) {
      this.setDataValue('name', UserModel.cleanName(val));
    },
    get: function() {
      let name = this.getDataValue('name');
      if (name) {
        return name;
      } else {
        name = [
          this.getDataValue('firstName'),
          this.getDataValue('lastName'),
        ]
            .filter((n) => {
              return !!n;
            })
            .join(' ');

        if (name) return name;
      }
      return null;
    },
  },
}, {
  validate: {
    externalIdImmutable: function() {
      if (this.changed('externalId')) {
        throw new Error('`externalId` cannot be changed after account creation.');
      }
    },
  },

  paranoid: false,
});


UserModel.cleanName = (name) => {
  if (name === null || name === undefined) {
    return name;
  }
  if (!_.isString(name)) {
    throw new Error('name must be a string or null');
  }

  return name.trim();
};

UserModel.cleanEmail = (email) => {
  if (!_.isString(email)) {
    throw new Error('email must be a string');
  }
  return email.trim().toLowerCase();
};

UserModel.prototype.toJSON = function(unsafe = false) {
  if (unsafe === true) {
    return _.clone(this.get({plain: true}));
  }

  const self = this;
  const json = [
    'name', 'firstName', 'lastName',
    'FBasid', 'FBpsid',
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

UserModel.validFields = ['name', 'firstName', 'lastName', 'FBpsid', 'FBasid', 'birthday'];


module.exports = UserModel;
