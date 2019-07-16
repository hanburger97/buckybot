'use strict';
// const config = require('src/util/config.js');
const router = require('express').Router();

// const MessengerBot = require('src/api/MessengerBot.js');

const bot = require('src/bot.js').bot;

router.post('/webhook', (req, res) => {
  
  bot.notifyObservers(req.body)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        //res.status(500).send(err);
        console.log(err);
        res.sendStatus(200);
      });
});

router.get('/webhook', (req, res) => {
  bot.verifyWebhook(req)
      .then((challenge) => {
        console.log('here');
        res.status(200).send(challenge);
      })
      .catch(() => {
        res.sendStatus(403);
      });
});

module.exports = router;
