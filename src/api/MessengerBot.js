'use strict';

const EventEmitter = require('events').EventEmitter;
const config = require('src/util/config.js');
const NOTIFICATION_TYPE = {
  REGULAR: 'REGULAR',
  SILENT_PUSH: 'SILENT_PUSH',
  NO_PUSH: 'NO_PUSH',
};

/**
 * @extends EventEmitter
 */
class MessengerBot extends EventEmitter {
  /**
    * Constructor
    */
  constructor() {
    super();
    this.token = config.get('facebook:page_access_token');
    this.verify_token = config.get('facebook:webhook_verify_token');
    this.debug = config.get('debug_mode');
  }
  /**
    * @param {id} id
    */
  getProfile(id) {

  }

  /**
    * @description sends a message to each recipients
    * @param {list<id>} recipients
    * @param {string} message
    * @param {enum} notification_type
    */
  sendMessage(recipients, message,
      notification_type = NOTIFICATION_TYPE.REGULAR) {

  }

  /**
    * @param {list<id>} recipients
    * @param {object} senderActions
    */
  sendSenderAction(recipients, senderActions) {

  }

  /**
    * @param {object} req
    * @return {Promise} a promise
    */
  verifyWebhook(req) {
    return new Promise((resolve, reject) => {
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];
      // Checks if a token and mode is in the query string of the request
      if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === this.verify_token) {
          // Responds with the challenge token from the request
          resolve(challenge);
        } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          reject(new Error('Wrong token'));
        }
      }
    });
  }

  /**
    * @param {object} msg
    * @return {Promise}
    */
  handleMessage(msg) {
    return new Promise((resolve, reject) => {
      // Using an Observer pattern with Javascript Event Handlers
      for (const entry of msg['entry']) {
        const events = entry['messaging'];
        for (const event of events) {
          if (event.message) {
            console.log('MessengerBot::HandleMessage');
            this.emitEvent('message', event);
          }
          // handle postbacks
          if (event.postback) {
            if (this.debug) {
              console.log('MessengerBot::HandlePostback');
              console.log(event);
            }
            this.emitEvent('postback', event);
          }

          // handle message delivered
          if (event.delivery) {
            this.emitEvent('delivery', event);
          }

          // handle message read
          if (event.read) {
            this.emitEvent('read', event);
          }

          // handle account_linking
          if (event.account_linking && event.account_linking.status) {
            if (event.account_linking.status === 'linked') {
              this.emitEvent('accountLinked', event);
            } else if (event.account_linking.status === 'unlinked') {
              this.emitEvent('accountUnlinked', event);
            }
          }
        }
      }
      resolve();
    });
  }

  /**
    * @param {string} type
    * @param {object} event
    */
  emitEvent(type, event) {
    this.emit(type, {
      senderId: event["sender"]["id"],
      payload: event,
      reply: this.sendMessage.bind(this, event.sender.id)
    });
  }
}

module.exports = MessengerBot;
