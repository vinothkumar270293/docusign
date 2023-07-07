const axios = require('axios');

const mailgun = require('../config/emailer');
const config = require('../config/config');
const templates = require('../templates');

const getDocumentFile = async (documentId) => {
  const response = await axios.get(`${config.boldsign.host}/v1/document/download?documentId=${documentId}`, {
    headers: {
      'X-API-KEY': config.boldsign.key,
    },
    responseType: 'arraybuffer',
  });
  const signedDocumentData = response.data;
  return signedDocumentData;
};

const getViewDocumentLink = async ({documentId, signerEmail}) => {
  const embeddedSignLinkResponse = await axios.get(
    `${config.boldsign.host}/v1/document/getEmbeddedSignLink?documentId=${documentId}&signerEmail=${signerEmail}&redirectUrl=${config.website.host}/e-sign/complete`,
    {
      headers: {
        accept: 'application/json',
        'X-API-KEY': config.boldsign.key,
        'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
      },
    }
  );
  const signLink = embeddedSignLinkResponse.data?.signLink;

  return signLink;
}

const getAuditFile = async (documentId) => {
  const response = await axios.get(`${config.boldsign.host}/v1/document/downloadauditlog?documentId=${documentId}`, {
    headers: {
      'X-API-KEY': config.boldsign.key,
    },
    responseType: 'arraybuffer',
  });
  return response.data;
};

const sendSignedEmail = async ({ data }) => {

  const signedDocumentData = await getDocumentFile(data.documentId);

  const signer = data.signerDetails
  .filter(signer => signer.status === "Completed")
  .reduce((firstSigner, currentSigner) => {
    if (!firstSigner || currentSigner.lastActivityDate > firstSigner.lastActivityDate) {
      return currentSigner;
    }
    return firstSigner;
  }, null);

  if(!signer) return;

  const documentLink = await getViewDocumentLink({documentId: data.documentId, signerEmail: signer.signerEmail});

  const requestData = {
    from: `Vakilsearch <doc@${config.mailgun.emailDomain}>`,
    to: signer.signerEmail,
    subject: `You have successfully signed ${data.messageTitle} - Vakilsearch`,
    html: templates.signedDocumentTemplate({ document: data, documentLink: `${config.website.host}/e-sign/?${documentLink.split('?')[1]}}` }),
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

const sendSignDocumentEmail = async ({ data }) => {
  const { signerDetails } = data;
  for (let signer of signerDetails) {
    const embeddedSignLinkResponse = await axios.get(
      `${config.boldsign.host}/v1/document/getEmbeddedSignLink?documentId=${data.documentId}&signerEmail=${signer.signerEmail}&redirectUrl=${config.website.host}/e-sign/complete`,
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
        signLink: `${config.website.host}/e-sign/?${signLink.split('?')[1]}}`,
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
  const { signerDetails, ccDetails, documentId } = data;

  if (signerDetails.length < 2) return;

  const signedUsers = signerDetails.filter((signer) => signer.status == 'Completed');

  const signedDocumentData = await getDocumentFile(documentId);
  const auditDocumentData = await getAuditFile(documentId);

  const users = [...signerDetails];
  const ccuser = ccDetails[0];

  if (ccuser) users.push({ signerEmail: ccuser.emailAddress, signerName: ccuser.emailAddress.split('@')[0] });

  for (let user of users) {
    const requestConfig = {
      from: `Vakilsearch <support@${config.mailgun.emailDomain}>`,
      to: user.signerEmail,
      subject: `Everyone has successfully completed ${data.messageTitle}`,
      html: templates.completedDocumentTemplate({
        document: {
          ...data,
          signerDetails: signedUsers,
          documentLink: `${config.website.host}/e-sign/?documentId=${data.documentId}`,
        },
        fromUser: user,
      }),
      attachment: [
        new mailgun.Attachment({
          data: signedDocumentData,
          filename: 'signed_document.pdf',
        }),
        new mailgun.Attachment({
          data: auditDocumentData,
          filename: 'auditlog.pdf',
        }),
      ],
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
  sendCompletedEmail,
};
