'use strict';

const Migration = {

    up: (queryInterface, schema, Sequelize) => {
        return createUserTable(queryInterface, schema, Sequelize);
    },

    down: (queryInterface, schema, Sequelize) => {
        return queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.dropTable({ tableName: 'Users', schema });
        });
    }
};

const createUserTable = (queryInstance, schema, Sequelize) => {
    return queryInstance.createTable(
        'Users',
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
            email: {
                type: Sequelize.STRING
            },
            FBasid: {
                type: Sequelize.TEXT
            },
        
            FBpsid: {
                type: Sequelize.TEXT,
                allowNull: false
            },

            fristName: {
                type: Sequelize.TEXT
            },

            lastName: {
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
