'use strict';

const EventEmitter = require('events').EventEmitter;

const NOTIFICATION_TYPE = {
    REGULAR: 'REGULAR',
    SILENT_PUSH: 'SILENT_PUSH',
    NO_PUSH: 'NO_PUSH'
}

class MessengerBot extends EventEmitter {

    constructor(opts) {
        super();
        opts = opts || {}
        if (!opts.token) {
            throw new Error('Missing page token. See FB documentation for details: https://developers.facebook.com/docs/messenger-platform/quickstart')
        }
        this.token = opts.token
        this.app_secret = opts.app_secret || false
        this.verify_token = opts.verify || false


    }

    getProfile(id) {

    }

    sendMessage(recipients, message, notification_type = NOTIFICATION_TYPE.REGULAR) {

    }

    sendSenderAction(recipients, senderActions) {

    }

    handleMessage(msg) {

    }
}   