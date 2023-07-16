const express = require('express');

const router = express.Router();
const emailController = require('../../controllers/email.controller');

router.route('/receive').post(emailController.handleSendDocument);

module.exports = router;
