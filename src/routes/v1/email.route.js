const express = require('express');
const multer = require('multer');

const router = express.Router();
const emailController = require('../../controllers/email.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.route('/receive').post(emailController.handleSendDocument);
router.route('/signDocument').post(upload.single('file'), emailController.handleSignDocument);

module.exports = router;
