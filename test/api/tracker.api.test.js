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
    let sampleUsers;

    before('Await DB', () => {
        return testing.dbReady;
    });

    before('Clear Expenses and Users', async ()=> {
        await ExpenseTrackerHelpers.clearAllUsers();
        await ExpenseTrackerHelpers.clearAllExpenses();
        await ExpenseTrackerHelpers.clearAllAssociations();
    })

    before('Create some dummy users', async () => {
        await ExpenseTrackerHelpers.createUsers(ExpenseTrackerHelpers.sampleUsers);
        sampleUsers = await ExpenseTrackerHelpers.getSampleUsers();
    });

    after('Clear Expense and Users', async () => {
        await ExpenseTrackerHelpers.clearAllUsers();
        await ExpenseTrackerHelpers.clearAllExpenses();
        await ExpenseTrackerHelpers.clearAllAssociations();
    });
    
    it('creates a new expense for user0 by id and by PSID', async () => {
        let usr0 = sampleUsers[0];
        const expense1 = await expenseTrackerAPI.createNewExpense(
            'expense1', 20.0, usr0
        );
        expense1.should.have.property('id');
        expense1.should.have.property('title');
        expense1.title.should.be.equal('expense1');
        expense1.amount.should.be.equal(20.0);
    });

    it('gets amount owed for one expense associated with 2 users', async () => {
        let usr0 = sampleUsers[0];
        const sharedExpense = await expenseTrackerAPI.createNewExpense(
            'shared_expense', 40.0, usr0
        );
        sharedExpense.id.should.exist;
        await expenseTrackerAPI.addPeopleToExpense(sharedExpense.id, [
            sampleUsers[1].id,
            sampleUsers[2].id
        ]);

        const amountOwed = await expenseTrackerAPI.getAmountOwed(usr0.id);
        amountOwed[sampleUsers[1].id].should.exist;
        amountOwed[sampleUsers[2].id].should.exist;
        amountOwed[sampleUsers[1].id]['total'].should.equal(20.0);
        amountOwed[sampleUsers[2].id]['total'].should.equal(20.0);
    })

    
    

})