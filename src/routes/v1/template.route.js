const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const templateController = require('../../controllers/template.controller');

const router = express.Router();

router.route('/').get(templateController.getTemplates).post(templateController.createTemplate);

router.route('/:id').get(templateController.templateDetails).delete(templateController.deleteTemplate);

module.exports = router;
