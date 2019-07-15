'use strict';

const Migration = {

    up: (queryInterface, schema, Sequelize) => {
        return createExpenseTable(queryInterface, schema, Sequelize);
    },

    down: (queryInterface, schema, Sequelize) => {
        return queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.dropTable({ tableName: 'Expenses', schema });
        });
    }
};

const createExpenseTable = (queryInstance, schema, Sequelize) => {
    return queryInstance.createTable(
        'Expenses',
        {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },

            externalId: {
                type: Sequelize.UUID,
                unique: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            payerId: {
                type: Sequelize.UUID,
                allowNull: false
            },
        
            amount: {
                type: Sequelize.FLOAT,
                allowNull: false
            },
        
            currency: {
                type: Sequelize.TEXT,
                allowNull: false
            },
        
            title: {
                type: Sequelize.TEXT
            },
        
            description: {
                type: Sequelize.TEXT
            },
            createdAt: { type: Sequelize.DATE },
            updatedAt: { type: Sequelize.DATE },
            deletedAt: { type: Sequelize.DATE }
            
        },{
            schema: schema
        }
    );
};

module.exports = Migration;
