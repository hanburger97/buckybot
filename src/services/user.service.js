'use strict';

const _ = require('lodash');

const UserModel = require('src/model/user.model.js');
const ExpenseModel = require('src/model/expense.model.js');

const UserService = {

  create: (userData) => {
    const filteredData = _.pick(userData, UserModel.validFields);
    return UserModel.create(filteredData);
  },

  /**
   * Find or create User then return data
   * @param {object} userData
   * @return User associated with this
   */
  findOrCreate: (userData) => {
    const filteredData = _.pick(userData, UserModel.validFields);
    UserModel.findOrCreate({
      where: {
        psid: userData.psid,
      },
      defaults: filteredData,
    }).then(([users]) => {
      return userData;
    });
  },


  getUserById: (userId) => {
    return UserModel.findOne({
      where: {
        externalId: userId,
      },
    });
  },

  getManyById: (userIds) => {
      return UserModel.findAll({
          where: {
              externalId: userIds
        }
      });
  },


  getUserByPSID: (psid) => {
    return UserModel.findOne({
      where: {
        FBpsid: psid,
      },
    });
  },

  getUserByASID: (asid) => {
    // To be implemented
  },

  addExpenseToManyUsers: (expenseId, userIds) => {
    let users;
    return UserModel.findAll({
      where: {
        externalId: userIds,
      },
    })
        .then((usrs) => {
          users = usrs;
          return ExpenseModel.findOne({
            where: {
              externalId: expenseId,
            },
          });
        })
        .then((expense) => {
          return expense.addUsers(users);
        });
  },
};

module.exports = UserService;
