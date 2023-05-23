const config = require('./config');

const mailgun = require('mailgun-js')({
  apiKey: config.mailgun.apikey,
  domain: config.mailgun.emailDomain,
});

module.exports = mailgun;
