'use strict';
const testing = require('../test.init.js');

const ExpenseTrackerAPI = require('src/api/tracker/tracker.api.js');
const ExpenseTrackerHelpers = require('test/helpers/tracker.helpers.js');

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-string'))
    .should();

describe('ExpenseTracker API Unit Tests',() => {

    const expenseTrackerAPI = new ExpenseTrackerAPI();

    before('Await DB', () => {
        return testing.dbReady;
    });

    before('Clear Expenses and Users', ()=> {
        return ExpenseTrackerHelpers.clearAllUsers()
        .then(()=> {
            return ExpenseTrackerHelpers.clearAllExpenses();
        })
        .then(() => {
            return ExpenseTrackerHelpers.clearAllAssociations();
        })
    })

    before('Create some dummy users', () => {
        return ExpenseTrackerHelpers.createUsers(ExpenseTrackerHelpers.sampleUsers);
    });


    it('dummy', () => {
        let t = true;
        t.should.be.true;
    })

    after('Clear Expense and Users', () => {
        return ExpenseTrackerHelpers.clearAllUsers()
        .then(()=> {
            return ExpenseTrackerHelpers.clearAllExpenses();
        })
        .then(() => {
            return ExpenseTrackerHelpers.clearAllAssociations();
        })
    })
    

})