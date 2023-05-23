const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const webhookController = require('../../controllers/webhook.controller');

const router = express.Router();

router.route('/').post(webhookController.bindEvent);

module.exports = router;
