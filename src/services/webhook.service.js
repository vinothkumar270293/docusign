const axios = require('axios');

const mailgun = require('../config/emailer');
const config = require('../config/config');
const templates = require('../templates');

const getDocumentFile = async (documentId) => {
  const response = await axios.get(`${config.boldsign.host}/v1/document/download?documentId=${documentId}`, {
    headers: {
      'X-API-KEY': config.boldsign.key,
    },
    responseType: 'arraybuffer', // Set the response type to arraybuffer to receive binary data
  });
  const signedDocumentData = response.data;
  return signedDocumentData;
}

const sendSignedEmail = async ({ data }) => {

  const signedDocumentData = await getDocumentFile(data.documentId)

  const requestData = {
    from: `Vakilsearch <doc@${config.mailgun.emailDomain}>`,
    to: data.signerDetails[0].signerEmail,
    subject: 'You have successfully signed Commercial Agreement - Vakilsearch',
    html: templates.signedDocumentTemplate({ document: data }),
    attachment: new mailgun.Attachment({
      data: signedDocumentData,
      filename: 'signed_document.pdf',
    }),
  };

  mailgun.messages().send(requestData, (error, body) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent successfully:', body);
    }
  });

  return true;
};

/*
{
  "signerDetails": [
    {
      "signerName": "Dinesh I",
      "signerRole": "",
      "signerEmail": "dinesh20003456@gmail.com",
      "status": "NotCompleted",
      "enableAccessCode": false,
      "isAuthenticationFailed": null,
      "enableEmailOTP": false,
      "isDeliveryFailed": false,
      "isViewed": false,
      "order": 1,
      "signerType": "Signer",
      "isReassigned": false,
      "reassignMessage": null,
      "declineMessage": null
    }
  ]
}
*/

const sendSignDocumentEmail = async ({ data }) => {
  const { signerDetails } = data;
  for (let signer of signerDetails) {
    const embeddedSignLinkResponse = await axios.get(
      `${config.boldsign.host}/v1/document/getEmbeddedSignLink?documentId=${data.documentId}&signerEmail=${signer.signerEmail}&redirectUrl=http://localhost:3000/e-sign/complete`,
      {
        headers: {
          accept: 'application/json',
          'X-API-KEY': config.boldsign.key,
          'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
        },
      }
    );
    const signLink = embeddedSignLinkResponse.data?.signLink;
    const requestConfig = {
      from: 'Vakilsearch <support@esign-inc.vakilsearch.com>',
      to: signer.signerEmail,
      subject: 'Review and Sign Document - Vakilsearch',
      html: templates.signTemplate({
        signLink: `http://localhost:3000/e-sign/?${signLink.split('?')[1]}}`,
        user: signer,
        signerDetails,
      }),
    };

    mailgun.messages().send(requestConfig, (error, body) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent successfully:', body);
      }
    });
  }
};

const sendCompletedEmail = async ({ data }) => {
  const { signerDetails, documentId } = data;

  if(signerDetails.length < 2) return;

  const signedUsers = signerDetails.filter(signer => signer.status == 'Completed');

  const signedDocumentData = await getDocumentFile(documentId)

  for (let signer of signerDetails) {

    const requestConfig = {
      from: 'Vakilsearch <support@esign-inc.vakilsearch.com>',
      to: signer.signerEmail,
      subject: 'Review and Sign Document - Vakilsearch',
      html: templates.completedDocumentTemplate({
        document: {...data, signerDetails: signedUsers,
          documentLink: `http://localhost:3000/e-sign/?documentId=${data.documentId}`},
        fromUser: signer,
      }),
      attachment: new mailgun.Attachment({
        data: signedDocumentData,
        filename: 'signed_document.pdf',
      }),
    };

    mailgun.messages().send(requestConfig, (error, body) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent successfully:', body);
      }
    });
  }
};

module.exports = {
  sendSignedEmail,
  sendSignDocumentEmail,
  sendCompletedEmail
};
