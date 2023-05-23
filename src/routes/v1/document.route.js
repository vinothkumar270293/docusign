const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const documentController = require('../../controllers/document.controller');

const router = express.Router();

router.route('/').get(documentController.getDocuments).post(documentController.sendDocument);
router.route('/mutual').post(documentController.sendDocument);

router.route('/file').post(documentController.sendDocumentFromFile);

module.exports = router;
