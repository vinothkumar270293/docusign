const catchAsync = require('../utils/catchAsync');
const { mailService } = require('../services');

const handleSendDocument = catchAsync(async (req, res) => {
  await mailService.createAndSendDocument(req.body);
  res.json({ status: true, message: 'Success' });
});

const handleSignDocument = catchAsync(async (req, res) => {
  await mailService.initiateSignDocument({...req.body, attachment: req.file});
  res.json({ status: true, message: 'Success' });
});

module.exports = {
  handleSendDocument,
  handleSignDocument
};
