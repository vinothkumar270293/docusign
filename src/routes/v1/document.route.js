const express = require('express');
const documentController = require('../../controllers/document.controller');

const router = express.Router();

router.route('/').get(documentController.getDocuments).post(documentController.sendDocument);
router.route('/mutual').post(documentController.sendDocument);

router.route('/file').post(documentController.sendDocumentFromFile);

module.exports = router;
