const BaseObserver = require('src/api/fb/observers/observer.js');

class PostbackObserver extends BaseObserver{
    constructor() {
        super();
    }

    async handle(args){
        const user = await this.fixUser(args);

        await args.reply({
            text: "Postback received"
          })
          .catch(err => {
            console.log(err);
          })
    }
}

module.exports = PostbackObserver;