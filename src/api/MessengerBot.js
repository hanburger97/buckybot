'use strict';

const EventEmitter = require('events').EventEmitter;
const config = require('src/util/config.js');
const NOTIFICATION_TYPE = {
    REGULAR: 'REGULAR',
    SILENT_PUSH: 'SILENT_PUSH',
    NO_PUSH: 'NO_PUSH'
}

class MessengerBot extends EventEmitter {

    constructor() {
        super();
        this.token = config.get('facebook:page_access_token');
        this.verify_token = config.get('facebook:webhook_verify_token');
    }

    getProfile(id) {

    }

    sendMessage(recipients, message, notification_type = NOTIFICATION_TYPE.REGULAR) {

    }

    sendSenderAction(recipients, senderActions) {

    }

    verifyWebhook(req) {
        const _this = this;
        return new Promise((resolve, reject) => {
            let mode = req.query["hub.mode"];
            let token = req.query["hub.verify_token"];
            let challenge = req.query["hub.challenge"];
            // Checks if a token and mode is in the query string of the request
            if (mode && token) {
                // Checks the mode and token sent is correct
                if (mode === "subscribe" && token === _this.verify_token) {
                    // Responds with the challenge token from the request
                    resolve(challenge);
                } else {
                    // Responds with '403 Forbidden' if verify tokens do not match
                    reject();
                }
            }
        })

    }

    handleMessage(msg) {
        console.log("message received");
        console.log(msg);
    }
}

module.exports = MessengerBot;