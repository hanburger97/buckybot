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
        this.debug = config.get('debug_mode')
    }

    getProfile(id) {

    }

    sendMessage(recipients, message, notification_type = NOTIFICATION_TYPE.REGULAR) {

    }

    sendSenderAction(recipients, senderActions) {

    }

    verifyWebhook(req) {
        return new Promise((resolve, reject) => {
            let mode = req.query["hub.mode"];
            let token = req.query["hub.verify_token"];
            let challenge = req.query["hub.challenge"];
            // Checks if a token and mode is in the query string of the request
            if (mode && token) {
                // Checks the mode and token sent is correct
                if (mode === "subscribe" && token === this.verify_token) {
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
        return new Promise((resolve, reject) => {
            // Using an Observer pattern with Javascript Event Handlers
            for (let entry of msg['entry']) {

                let events = entry['messaging'];
                for (let event of events) {
                    if (event.message) {

                    }
                    // handle postbacks
                    if (event.postback) {
                        if (this.debug) {
                            console.log('MessengerBot::HandlePostback');
                            console.log(event);
                        }
                        this.emitEvent('postback', event)
                    }

                    // handle message delivered
                    if (event.delivery) {
                        this.emitEvent('delivery', event)
                    }

                    // handle message read
                    if (event.read) {
                        this.emitEvent('read', event)
                    }

                    // handle account_linking
                    if (event.account_linking && event.account_linking.status) {
                        if (event.account_linking.status === 'linked') {
                            this.emitEvent('accountLinked', event)
                        } else if (event.account_linking.status === 'unlinked') {
                            this.emitEvent('accountUnlinked', event)
                        }
                    }
                }

            }
            resolve();
        })

    }

    emitEvent(type, event) {
        this.emit(type, {
            senderId: event.sender.id,
            payload: event,
            reply: this.sendMessage.bind(this, event.sender.id)
        })
    }
}

module.exports = MessengerBot;