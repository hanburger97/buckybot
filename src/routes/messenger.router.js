'use strict';
const config = require('src/util/config.js');
const router = require('express').Router();

router.post('/webhook', (req, res) => {
    let body = req.body;
})

router.get('/webhook', (req, res) => {
    const MY_TOKEN = config.get('facebook:webhook_verify_token');

})