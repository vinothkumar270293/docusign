const catchAsync = require('../utils/catchAsync');

const logger = require('../config/logger');

const { webhookService } = require('../services');

const bindEvent = catchAsync(async (req, res) => {

  const { event, data } = req.body;

  try {
    const parsed = JSON.parse(data.documentDescription);
    data.metaData = parsed;
  } catch (error) {
    //
  }

  logger.info('********** Webhook Bind **********');
  logger.info(JSON.stringify(req.body));

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
    default:
      break;
  }

  res.json({ status: true, message: 'Success' });
});

module.exports = {
  bindEvent,
};
