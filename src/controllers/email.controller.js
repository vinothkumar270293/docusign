const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('../config/config');
const mailgun = require('../config/emailer');
const templates = require('../templates');
const stream = require('stream');

const path = require("path");
const baseDir = path.resolve(__dirname, '..');

const catchAsync = require('../utils/catchAsync');
const { webhookService } = require('../services');

const extractUser = (email) => {
    const splittedFrom = email.includes('&lt;') ? email.split('&lt;') : email.split('<')
    const fromUser = {
        userName: (splittedFrom[1] == null ? splittedFrom[0].split("@")[0] : splittedFrom[0]).replace(/"/g,"").trim(),
        email: (splittedFrom[1] || splittedFrom[0]).replace(/"/g,"").replace(/>/g,"").trim(),
    }
    return fromUser;
}

const handleSendDocument = catchAsync(async (req, res) => {
    const { Cc, attachments, Subject } = req.body;
    
    const From = req.body?.from || req.body?.From;
    if(!From) throw new Error("Sender details not found");

    const fromUser = extractUser(From)

    const ccs = []

    const fromCcs = Cc.split(",");
    if(fromCcs) {
        fromCcs.forEach(email => {ccs.push(extractUser(email))})
    }

    console.log("BODY", req.body);
    console.log("HEADERS", req.headers);
    const attachment = attachments ? JSON.parse(attachments)[0] : null;

    if(!attachment) {
        throw new Error("Attachment not found");
    }

    if(ccs.length == 0) 
        throw new Error("Include atleast one receiver")


    let documentConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: attachment.url,
        headers: { 
            'Authorization': `Basic ${config.mailgun.accessKey}`
        },
        responseType: 'arraybuffer'
    };

// Fetch the attachment binary data from the URL
  const response = await axios.request(documentConfig)
  
  const attachmentData = response.data;

// Specify the file path where you want to save the PDF
const filePath = `${baseDir}/files/${attachment.name}`;

// Write the binary data to a file
fs.writeFileSync(filePath, attachmentData);

  // Create a new FormData instance
  let data = new FormData();
  data.append('Title', Subject);
  data.append('ShowToolbar', 'true');
  data.append('ShowNavigationButtons', 'true');
  data.append('ShowPreviewButton', 'true');
  data.append('ShowSendButton', 'true');
  data.append('ShowSaveButton', 'true');
  data.append('SendViewOption', 'PreparePage');
  data.append('disableEmails', 'true');
  data.append('Locale', 'EN');
  // data.append('RedirectUrl', 'https://boldsign.dev/sign/redirect');
  data.append('Message', Subject);
  data.append('EnableSigningOrder', 'false');

  for (let index = 0; index < ccs.length; index++) {
      const fromUser = ccs[index];
      data.append(`Signers[${index}][Name]`, fromUser.userName);
      data.append(`Signers[${index}][EmailAddress]`, fromUser.email);
      data.append(`Signers[${index}][PrivateMessage]`, req.body.Subject);
      data.append(`Signers[${index}][FormFields][0][FieldType]`, `Signature`);
      data.append(`Signers[${index}][FormFields][0][Id]`, `${fromUser.email.split('@')[0]}_${index}`);
      data.append(`Signers[${index}][FormFields][0][PageNumber]`, `1`);
      data.append(`Signers[${index}][FormFields][0][IsRequired]`, `True`); 
      data.append(`Signers[${index}][FormFields][0][Bounds][X]`, `${50 * (index+1)}`);
      data.append(`Signers[${index}][FormFields][0][Bounds][Y]`, `${100 * (index+1)}`);
      data.append(`Signers[${index}][FormFields][0][Bounds][Width]`, `200`);
      data.append(`Signers[${index}][FormFields][0][Bounds][Height]`, `30`);
  }

  // Append the attachment binary data to the FormData instance
  data.append('Files', Buffer.from(attachmentData), {
    filename: attachment.name,
    contentType: attachment['content-type'],
  });

  let requestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${config.boldsign.host}/v1/document/createEmbeddedRequestUrl`,
    headers: {
      'X-API-KEY': config.boldsign.key,
        ...data.getHeaders()
    },
    data: data,
  };

  const documentResponse = await axios.request(requestConfig);

  const emailConfig = {
    from: `Vakilsearch <support@${config.mailgun.emailDomain}>`,
    to: fromUser.email,
    subject: 'Send Sign Document - Vakilsearch',
    html: templates.signTemplate({signLink: `${documentResponse.data.sendUrl}`,user:{
        roleIndex: 1,
        signerName: fromUser.userName,
        signerEmail: fromUser.email,
      }, signerDetails: fromCcs})
  };

  mailgun.messages().send(emailConfig, (error, body) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent successfully:', body);
    }
  });
    res.json({status: true})
});

module.exports = {
    handleSendDocument,
};
