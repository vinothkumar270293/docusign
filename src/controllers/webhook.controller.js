const catchAsync = require('../utils/catchAsync');
const { webhookService } = require('../services');

const bindEvent = catchAsync(async (req, res) => {
  console.log('Webhook Bind', req.body);

  const { event, data } = req.body;

  if (event.eventType == 'Signed') {
    await webhookService.sendSignedEmail({ data });
  }
  if (event.eventType == 'Sent') { 
    await webhookService.sendSignDocumentEmail({ data });
  }
  if(event.eventType == 'Completed') {
    await webhookService.sendCompletedEmail({ data });
  }
  res.json({ status: true, message: 'Success' });
});

module.exports = {
  bindEvent,
};
