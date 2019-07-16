const BaseObserver = require('src/api/messaging/observers/observer.js');

class QuickReplyObserver extends BaseObserver{
    constructor() {
        super();
    }

    async handle(args){
        const user = await this.fixUser(args);

        await args.reply({
            text: "Quick Reply received"
          })
          .catch(err => {
            console.log(err);
          })
    }
}
module.exports = QuickReplyObserver;