const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger');

const config = require('../config/config');
const mailgun = require('../config/emailer');
const templates = require('../templates');

const baseDir = path.resolve(__dirname, '..');

const extractUser = (email) => {
  const splitted = email.includes('&lt;') ? email.split('&lt;') : email.split('<');
  const signUser = {
    signerName: (splitted[1] == null ? splitted[0].split('@')[0] : splitted[0]).replace(/"/g, '').trim(),
    signerEmail: (splitted[1] || splitted[0]).replace(/"/g, '').replace(/>/g, '').trim(),
  };
  return signUser;
};

const parseEmailData = (requestData) => {
  const { Cc, attachments, Subject } = requestData;

  const From = requestData?.from || requestData?.From;
  if (!From) throw new ApiError(httpStatus.BAD_REQUEST, 'Sender details not found');

  const fromUser = extractUser(From);

  const signers = [];

  const fromCcs = Cc.split(',');
  if (fromCcs)
    fromCcs.forEach((email) => {
      signers.push(extractUser(email));
    });
  if (signers.length == 0) throw new ApiError(httpStatus.BAD_REQUEST, 'Include atleast one receiver');

  const attachment = attachments ? JSON.parse(attachments)[0] : null;
  if (!attachment) throw new ApiError(httpStatus.BAD_REQUEST, 'Attachment not found');

  return { from: From, fromUser, signers, attachment, subject: Subject };
};

const getAttachmentFile = async (attachment) => {
  let fileRequestConfig = {
    method: 'get',
    maxBodyLength: Infinity,
    url: attachment.url,
    headers: {
      Authorization: `Basic ${config.mailgun.accessKey}`,
    },
    responseType: 'arraybuffer',
  };

  const response = await axios.request(fileRequestConfig);
  const attachmentData = response.data;
  return attachmentData;
};

const createEmbbededDocument = async ({ attachmentData, subject, attachment, signers }) => {
  let data = new FormData();
  data.append('Files', Buffer.from(attachmentData), {
    filename: attachment.name,
    contentType: attachment['content-type'],
  });
  data.append('Title', subject);
  data.append('ShowToolbar', 'true');
  data.append('ShowNavigationButtons', 'true');
  data.append('ShowPreviewButton', 'true');
  data.append('ShowSendButton', 'true');
  data.append('ShowSaveButton', 'true');
  data.append('SendViewOption', 'PreparePage');
  data.append('disableEmails', 'true');
  data.append('Locale', 'EN');
  // data.append('RedirectUrl', 'https://boldsign.dev/sign/redirect');
  data.append('Message', subject);
  data.append('EnableSigningOrder', 'false');

  for (let index = 0; index < signers.length; index++) {
    const signUser = signers[index];
    data.append(`Signers[${index}][Name]`, signUser.signerName);
    data.append(`Signers[${index}][EmailAddress]`, signUser.signerEmail);
    data.append(`Signers[${index}][PrivateMessage]`, subject);
    data.append(`Signers[${index}][FormFields][0][FieldType]`, `Signature`);
    data.append(`Signers[${index}][FormFields][0][Id]`, `${signUser.signerEmail.split('@')[0]}_${index}`);
    data.append(`Signers[${index}][FormFields][0][PageNumber]`, `1`);
    data.append(`Signers[${index}][FormFields][0][IsRequired]`, `True`);
    data.append(`Signers[${index}][FormFields][0][Bounds][X]`, `${50 * (index + 1)}`);
    data.append(`Signers[${index}][FormFields][0][Bounds][Y]`, `${100}`);
    data.append(`Signers[${index}][FormFields][0][Bounds][Width]`, `200`);
    data.append(`Signers[${index}][FormFields][0][Bounds][Height]`, `30`);
  }

  let requestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${config.boldsign.host}/v1/document/createEmbeddedRequestUrl`,
    headers: {
      'X-API-KEY': config.boldsign.key,
      ...data.getHeaders(),
    },
    data: data,
  };

  const documentResponse = await axios.request(requestConfig);

  return documentResponse.data;
};

const sendDocumentLink = async ({ subject, sendUrl, fromUser, signers }) => {
  const emailConfig = {
    from: `Vakilsearch <support@${config.mailgun.emailDomain}>`,
    to: fromUser.signerEmail,
    subject: 'Create Sign Document - Vakilsearch',
    html: templates.signTemplate({
      signLink: sendUrl,
      user: {
        ...fromUser,
        roleIndex: 1
      },
      signerDetails: signers,
      subject,
    }),
  };

  mailgun.messages().send(emailConfig, (error, body) => {
    if (error) logger.error(error);
    else logger.info('Email sent successfully:', body);
  });
};

const createAndSendDocument = async (requestData) => {
  const emailData = parseEmailData(requestData);
  const { subject, fromUser, signers, attachment } = emailData;

  const attachmentData = await getAttachmentFile(attachment);
  const { sendUrl } = await createEmbbededDocument({ attachmentData, subject, attachment, signers });

  sendDocumentLink({ subject, sendUrl, fromUser, signers });
};

module.exports = {
  createAndSendDocument,
};
