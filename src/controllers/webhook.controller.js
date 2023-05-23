const catchAsync = require('../utils/catchAsync');
const { webhookService } = require('../services');

const bindEvent = catchAsync(async (req, res) => {
  console.log('Webhook Bind', req.body);

  const { event, data } = req.body;

  switch (event.eventType) {
    case 'Signed':
      await webhookService.sendSignedEmail({ data });
      break;
    case 'Sent':
      await webhookService.sendSignDocumentEmail({ data });
      break;
    case 'Completed':
      await webhookService.sendCompletedEmail({ data });
      break;
  }

  res.json({ status: true, message: 'Success' });
});

module.exports = {
  bindEvent,
};
