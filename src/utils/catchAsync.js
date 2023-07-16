const logger = require("../config/logger");

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    logger.error(err);
    if (err.response) logger.error(JSON.stringify(err.response.data));
    next(err);
  });
};

module.exports = catchAsync;
