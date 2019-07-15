'use strict';

const Migration = {

    up: (queryInterface, schema, Sequelize) => {
        return createUsersExpensesJoinTable(queryInterface, schema, Sequelize);
    },

    down: (queryInterface, schema, Sequelize) => {
        return queryInterface.sequelize.transaction( async (transaction) => {
            await queryInterface.dropTable({ tableName: 'UsersExpenses', schema });
        });
    }
};

const createUsersExpensesJoinTable = (queryInterface, schema, Sequelize) => {
    queryInterface.createTable(
        'UsersExpenses',
        {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
        
            userId: {
                type: Sequelize.BIGINT,
                allowNull: false
            },
        
            expenseId: {
                type: Sequelize.BIGINT,
                allowNull: false
            },

            createdAt: { type: Sequelize.DATE },
            updatedAt: { type: Sequelize.DATE },
        }, {
            schema: schema
        }
    );
};

module.exports = Migration;
