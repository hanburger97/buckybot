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

    afterEach('Clear Expense and associtations', async () => {
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
            'shared_expense', 60.0, usr0
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
    });

    it('gets how much one owes', async () => {
        const usr0 = sampleUsers[0];
        const usr1 = sampleUsers[1];
        const usr2 = sampleUsers[2];

        const firstExpense = await expenseTrackerAPI.createNewExpense(
            'expense_f1', 60.60, usr1
        ); 
        const secondExpense = await expenseTrackerAPI.createNewExpense(
            'expense_f1', 22.50, usr1
        );
        const thirdExpense = await expenseTrackerAPI.createNewExpense(
            'expense_f1', 100.90, usr0
        );

        await expenseTrackerAPI.addPeopleToExpense(firstExpense.id, [
            usr2.id, usr0.id
        ]);// 20.20 / person owes to usr1
        await expenseTrackerAPI.addPeopleToExpense(secondExpense.id, [usr2.id]);
        // 11.25 /person owes to usr1
        await expenseTrackerAPI.addPeopleToExpense(thirdExpense.id, [usr2.id]);
        // 50.45 / person owes to usr0

        // Total : 31.45 to usr1 and 50.45 to usr2
        const res = await expenseTrackerAPI.getDebts(usr2.id);
        res.length.should.equal(2);
        res[0].payerId.should.exist;
        res[0].payerId.should.equal(usr1.id);
        res[0].total.should.equal((60.6/3 + 22.50/2));
        res[1].payerId.should.exist;
        res[1].payerId.should.equal(usr0.id);
        res[1].total.should.equal((100.90/2));
    });

    it('tests the debt clearing for a given debtor and a owner', async () => {
        const usr0 = sampleUsers[0];
        const usr1 = sampleUsers[1];
        const usr2 = sampleUsers[2];
        const exp_1 = await expenseTrackerAPI.createNewExpense(
            'expense_d1', 60, usr0
        );
        const exp_2 = await expenseTrackerAPI.createNewExpense(
            'expense_d2', 40, usr1
        );
        const exp_3 = await expenseTrackerAPI.createNewExpense(
            'expense_d3', 40, usr0
        );

        await expenseTrackerAPI.addPeopleToExpense(exp_2.id, [usr2.id]);
        await expenseTrackerAPI.addPeopleToExpense(exp_1.id, [usr1.id, usr2.id]);
        await expenseTrackerAPI.addPeopleToExpense(exp_3.id, [usr2.id]);
        
        await expenseTrackerAPI.clearDebts(usr0.id, usr2.id);

        const res = await expenseTrackerAPI.getDebts(usr2.id);
        res.length.should.equal(1);
        res[0].payerId.should.equal(usr1.id);
        res[0].total.should.equal(20.0);

    })

    
    

})