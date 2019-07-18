'use strict';

const EventEmitter = require('events').EventEmitter;
const config = require('src/util/config.js');
const axios = require('axios');


const MESSAGE_TYPE = {
  RESPONSE: 'RESPONSE',
  UPDATE: 'UPDATE',
  MESSAGE_TAG: 'MESSAGE_TAG'
}

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
    this.baseUrl = config.get('facebook:api_url');
    this.debug = config.get('debug_mode');
    this.axios = axios.create();
    this.post = this.post.bind(this);
  }

  post(payload) {
    return this.axios({
      method: "POST",
      ...payload,
      params: {
        access_token: this.token
      }
    })
  }


  /**
    * @param {id} id
    */
  getProfile(psid, fields = 'first_name, last_name') {
    console.log(fields);
    return this.post({
          url: `${this.baseUrl}/${psid}`,
          method: 'GET',
          params: {
            access_token: this.token,
            fields
          }
    });
  }

  /**
    * @description sends a message to each recipients
    * @param {list<id>} recipients
    * @param {string} message
    * @param {enum} notification_type
    */
  sendMessage(recipients, message,
      message_type = MESSAGE_TYPE.RESPONSE) {
    return this.post({ 
      url: `${this.baseUrl}/me/messages`,
      data: {
        recipient: {id: recipients},
        message,
        message_type
      }
    });
  }

  setThreadSettings({ setting_type, threadState, settings }){
    return axios.post(`${this.baseUrl}/me/thread_settings`,{
          params: {
            access_token: this.token
          },
          data: {
            setting_type,
            threadState,
            settings
          }
    });
  }

  /**
    * @param {list<id>} recipients
    * @param {object} senderActions
    */
  sendSenderAction(recipients, sender_action) {
    return axios.post( `${this.baseUrl}/me/messages`,{
          params: {
            access_token: this.token
          },
          data: {
            recipient: {id: recipients},
            message,
            sender_action
          }
    });
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
  notifyObservers(msg) {
    return new Promise((resolve, reject) => {
      // Using an Observer pattern with Javascript Event Handlers
      for (const entry of msg['entry']) {
        const events = entry['messaging'];
        for (const event of events) {
          if (event.message) {
            if (this.debug){
              console.log('MessengerBot::HandleMessage');
              console.log(event);
            }
            if (event.message.is_echo) {
              this.emitEvent('echo', event);
            } 
            else if (event.message.quick_reply){
              this.emitEvent('quick_reply', event)
            }
            else {
              this.emitEvent('message', event);
            }
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
      senderId: event['sender']['id'],
      payload: event,
      reply: this.sendMessage.bind(this, event.sender.id),
      getProfile: this.getProfile.bind(this, event.sender.id)
    });
  }
}

module.exports = MessengerBot;
