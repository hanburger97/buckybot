'use strict';
const config = require('src/util/config.js');
const router = require('express').Router();

const MessengerBot = require('src/api/MessengerBot.js');

let bot = new MessengerBot();

router.post('/webhook', (req, res) => {
    let body = req.body;
    console.log(body);
    res.status(200);
});

router.get('/webhook', (req, res) => {

    bot.verifyWebhook(req)
        .then((challenge) => {
            res.status(200).send(challenge);
        })
        .catch(() => {
            res.sendStatus(403);
        });
});

module.exports = router;