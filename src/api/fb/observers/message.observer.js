'use strict';
const BaseObserver = require('src/api/fb/observers/observer.js');


class MessageObserver extends BaseObserver {

  constructor(){
    super();
  }

  async handle(args) {
    console.log(JSON.stringify(args));
    // Fetch the current user
    const user = await this.fixUser(args);
    
    
    await args.reply({
      text: "Message received",
      quick_replies: [
        {
          "content_type":"text",
          "title":"Red",
          "payload":"<POSTBACK_PAYLOAD>",
          "image_url":"http://example.com/img/red.png"
        },
        {
          "content_type":"text",
          "title":"Green",
          "payload":"<POSTBACK_PAYLOAD>",
          "image_url":"http://example.com/img/green.png"
        }
      ]
    })
    .catch(err => {
      console.log(err);
    })
  }
}

module.exports = MessageObserver;
