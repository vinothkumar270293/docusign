const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const { toTitleCase } = require('../utils');

const logger = require('../config/logger');
const config = require('../config/config');
const mailgun = require('../config/emailer');
const templates = require('../templates');

const baseDir = path.resolve(__dirname, '..');

export const extractNameFromEmail = (email) => {
  const name = email.replace(/"/g, '').trim();
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const extractUser = (email) => {
  const splitted = email.includes('&lt;') ? email.split('&lt;') : email.split('<');
  const signUser = {
    signerName: splitted[1] == null ? splitted[0].split('@')[0] : extractNameFromEmail(splitted[0]),
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

const createEmbbededDocument = async ({ attachmentData, subject, attachment, fromUser, signers, metaDetails }) => {
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
  data.append('RedirectUrl', `${config.website.host}/e-sign/complete`);
  data.append('Message', JSON.stringify(metaDetails));
  data.append('EnableSigningOrder', 'false');
  data.append('senderDetail.name', fromUser.signerName);
  data.append('senderDetail,emailAddress', fromUser.signerEmail);

  for (let index = 0; index < signers.length; index++) {
    const signUser = signers[index];
    data.append(`Signers[${index}][Name]`, signUser.signerName);
    data.append(`Signers[${index}][EmailAddress]`, signUser.signerEmail);
    data.append(`Signers[${index}][PrivateMessage]`, subject);
  }

  data.append(`CC[0][Name]`, fromUser.signerName);
  data.append(`CC[0][EmailAddress]`, fromUser.signerEmail);

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

const sendDocumentLink = async ({ subject, sendUrl, fromUser, signers, metaDetails }) => {
  const emailConfig = {
    from: `Magicsign <support@${config.mailgun.emailDomain}>`,
    to: fromUser.signerEmail,
    subject: 'Create Sign Markers - Magicsign',
    html: templates.createSignTemplate({
      signLink: `${config.website.host}/e-sign/view?${sendUrl.split('?')[1]}`,
      user: {
        ...fromUser,
        roleIndex: 1,
      },
      signerDetails: signers,
      senderDetails: [
        {
          senderName: fromUser.signerEmail,
          senderEmail: fromUser.signerName,
        },
      ],
      ...metaDetails,
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

  const metaDetails = {
    sender: {
      name: fromUser.signerName,
      email: fromUser.signerEmail,
    },
    document: {
      name: toTitleCase(attachment.name.split(".")?.[0] || "NA"),
    },
  };

  const attachmentData = await getAttachmentFile(attachment);
  const { sendUrl } = await createEmbbededDocument({ ...emailData, metaDetails, attachmentData });

  sendDocumentLink({ metaDetails, subject, sendUrl, fromUser, signers });
};

module.exports = {
  createAndSendDocument,
};
