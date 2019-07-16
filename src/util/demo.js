'use strict';
const uuid = require('uuid/v4');

const UserModel = require('src/model/user.model.js');
const UserService = require('src/services/user.service.js');

const sampleUsers = [
    {
        name: "bob",
        firstName: "bob",
        FBpsid: uuid(),
        email: 'bob@gmail.com'
    },
    {
        name: "alice",
        firstName: "alice",
        FBpsid: uuid(),
        email: 'alice@gmail.com'
    },
    {
        name: "foo",            
        firstName: "foo",
        FBpsid: uuid(),
        email: 'foo@gmail.com'
    }
];

const demoUtils = {

    sampleUsers: sampleUsers,
    
    getDummyUsers: async () => {
        try{
            let users = await UserModel.findAll({
                where: {
                    email: ['bob@gmail.com', 'alice@gmail.com']
                }
            })
            return users;
        }
        catch(err) {
            console.log('Error in Demo utils');
            console.log(err);
            return null;
        }
    },

    initUsers : () => {
        return UserModel.findAll({
            where: {
                email: ['bob@gmail.com', 'alice@gmail.com', 'foo@gmail.com']
            }
        })
        .then((users) => {
            if ([]===users || undefined === users){
                throw 10;
            }
        })
        .catch(() => {
            return Promise.all(sampleUsers.map(x => {
                return UserModel.create(x);
            }))
        })
    }
}

module.exports = demoUtils;