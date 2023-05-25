const express = require('express');
const webhookController = require('../../controllers/webhook.controller');

const router = express.Router();

router.route('/').post(webhookController.bindEvent);

module.exports = router;
