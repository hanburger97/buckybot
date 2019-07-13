'use strict';

const router = require('express').Router();

router.use('/messenger', require('src/routes/messenger.router.js'));

module.exports = router;
