'use strict';

const uuid = require('uuid/v4');
const UserModel = require('src/model/user.model.js');
const ExpenseModel = require('src/model/expense.model.js');
const UserExpenseJoinModel = require('src/model/user.expense.model.js');

const ExpenseTrackerHelpers = {
    sampleUsers: [
        {
            name: "user0",
            FBpsid: uuid(),
            email: 'user0@gmail.com'
        },
        {
            name: "user1",
            FBpsid: uuid(),
            email: 'user1@gmail.com'
        },
        {
            name: "user2",
            FBpsid: uuid(),
            email: 'user2@gmail.com'
        }
    ],

    getSampleUsers: async () => {
        const users = await UserModel.findAll();
        return Promise.all(users.map(x => {
            return x.toJSON();
        }))
    },

    createUsers: (users) => {
        return Promise.all(users.map((usr) => {
            return UserModel.create(usr);
        }))
    },

    clearAllUsers: () => {
        return UserModel.destroy({
            truncate: true,
            cascade: true
        });
    },

    clearAllAssociations: () => {
        return UserExpenseJoinModel.destroy({
            truncate: true,
            cascade: true
        });
    },

    clearAllExpenses: () => {
        return ExpenseModel.destroy({
            truncate: true,
            cascade: true
        });
    }

};

module.exports = ExpenseTrackerHelpers;

