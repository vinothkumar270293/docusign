const logger = require("../config/logger");

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.log("ERROR");
    logger.error(err);
    if (err.response) {
      console.log(err.response);
      logger.error('API_ERROR');
      logger.error(JSON.stringify(err.response.data));
    }
    next(err);
  });
};

module.exports = catchAsync;
