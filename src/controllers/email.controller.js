const catchAsync = require('../utils/catchAsync');
const { mailService } = require('../services');

const handleSendDocument = catchAsync(async (req, res) => {
  await mailService.createAndSendDocument(req.body);
  res.json({ status: true, message: 'Success' });
});

module.exports = {
  handleSendDocument,
};
