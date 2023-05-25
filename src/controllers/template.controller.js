const catchAsync = require('../utils/catchAsync');
const { templateService } = require('../services');

const getTemplates = catchAsync(async (req, res) => {
  const { query } = req;
  const data = await templateService.getTemplates({ query })
  res.json({ status: true, data });
});

const createTemplate = catchAsync(async (req, res) => {
  const { body } = req;
  const data = await templateService.createTemplate({ data: body })
  res.json({ status: true, data });
});

const deleteTemplate = catchAsync(async (req, res) => {
  const { query } = req;
  const data = await templateService.deleteTemplate({ query })
  res.json({ status: true, data });
});

const templateDetails = catchAsync(async (req, res) => {
  const { query } = req;
  const data = await templateService.templateDetails({ query })
  res.json({ status: true, data });
});

module.exports = {
  getTemplates,
  createTemplate,
  deleteTemplate,
  templateDetails,
};
