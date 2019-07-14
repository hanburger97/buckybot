'use strict';

const _ = require('lodash');

const UserModel = require('src/models/user.model.js');

const UserService = {

  create: (userData) => {
    const filteredData = _.pick(userData, UserModel.validFields);
    UserModel.create(filteredData);
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
};

module.exports = UserService;
