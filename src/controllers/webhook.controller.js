const catchAsync = require('../utils/catchAsync');

const logger = require('../config/logger');

const { webhookService } = require('../services');

const bindEvent = catchAsync(async (req, res) => {
  logger.debug('=== Webhook Bind ===');
  logger.debug(JSON.stringify(req.body));

  const { event, data } = req.body;

  try {
    const parsed = JSON.parse(data.documentDescription);
    data.metaDeta = parsed;
  } catch (error) {
    //
  }

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
