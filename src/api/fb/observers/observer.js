'use strict';
const UserService = require('src/services/user.service.js');

class BaseObserver {

  constructor(){}

  fixUser(args) {
    let user;

    return UserService.getUserByPSID(args.senderId)
    .then((usr) => {
      if (null=== usr || undefined===usr){
        throw 10;
      }
      user = usr.toJSON();
      return user;
    })
    .catch((err) => {
      if (10 === err){
        return args.getProfile()
        .then(({data}) => {
          return UserService.create({
            firstName : data.first_name,
            lastName : data.last_name,
            name : data.first_name  + " " + data.last_name,
            FBpsid: data.id
          });
        })
        .then((res) => {
          console.log(res);
          user = res.toJSON();
          return user;
        }) 
        .catch(err => {
          console.log(err)
        })
      }
    })
    
  }
  
  handle(args) {
    console.log('Base Handler Invoked: No Handler available for: ', args);
  }
}
module.exports = BaseObserver;
