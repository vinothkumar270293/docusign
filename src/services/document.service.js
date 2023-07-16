const axios = require('axios');

const config = require('../config/config');
const mailgun = require('../config/emailer');
const logger = require('../config/logger');

const templates = require('../templates');

const sendDocumentFromTamplate = async () => {
  const user = {
    roleIndex: 1,
    signerName: 'Dinesh',
    signerEmail: 'dineshiyyandhurai@gmail.com',
  };

  const response = await axios.post(
    `${config.boldsign.host}/v1/template/send`,
    {
      roles: [user],
      disableEmails: true,
      brandId: '24f92e35-a779-4418-8e1b-54d0ca85ecc0',
    },
    {
      params: {
        templateId: '8cbeb869-6315-4f59-9944-259da04f3e13',
      },
      headers: {
        accept: 'application/json',
        'X-API-KEY': config.boldsign.key,
        'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
      },
    }
  );

  const { documentId } = response.data;

  const embeddedSignLinkResponse = await axios.get(
    `${config.boldsign.host}/v1/document/getEmbeddedSignLink?documentId=${documentId}&signerEmail=${user.signerEmail}&redirectUrl=${config.website.host}/e-sign/complete`,
    {
      headers: {
        accept: 'application/json',
        'X-API-KEY': config.boldsign.key,
        'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
      },
    }
  );
  const signLink = embeddedSignLinkResponse.data?.signLink;

  const data = {
    from: 'Vakilsearch <doc@esign-inc.vakilsearch.com>',
    to: user.signerEmail,
    subject: 'Review and Sign Document - Vakilsearch',
    html: templates.signTemplate({
      signLink: `${config.website.host}/e-sign/?${signLink.split('?')[1]}}`,
      user,
      signerDetails: [user],
    }),
  };

  mailgun.messages().send(data, (error, body) => {
    if (error) logger.error(error);
    else logger.debug('Email sent successfully:', body);
  });

  return response.data;
};

const sendDocumentFromFile = async () => {
  let data = new FormData();
  data.append('Title', 'Commercial Agreement');
  data.append('Message', 'Terms, purpose and duration of agreement ');
  data.append('EnableSigningOrder', 'true');
  data.append('Signers[0][Name]', 'Dinesh');
  data.append('Signers[0][EmailAddress]', 'dinesh.iyyandurai@vakilsearch.com');
  data.append('Signers[0][SignerOrder]', '1');
  data.append('Signers[0][FormFields][0][FieldType]', 'Signature');
  data.append('Signers[0][FormFields][0][Name]', 'sign_field');
  data.append('Signers[0][FormFields][0][PageNumber]', '5');
  data.append('Signers[0][FormFields][0][Bounds][X]', '500');
  data.append('Signers[0][FormFields][0][Bounds][Y]', '700');
  data.append('Signers[0][FormFields][0][Bounds][Width]', '200');
  data.append('Signers[0][FormFields][0][Bounds][Height]', '32');
  data.append('Signers[0][FormFields][0][IsRequired]', 'true');
  data.append('Signers[0][authenticationCode]', '123');
  data.append('CC[0].EmailAddress', 'dinesh20003456@gmail.com');
  data.append('Files', fs.createReadStream(`${baseDir}/data/agreement.pdf`));

  let requestConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${config.boldsign.host}/v1/document/send`,
    headers: {
      'X-API-KEY': config.boldsign.key,
      ...data.getHeaders(),
    },
    data,
  };

  const response = await axios.request(requestConfig);

  return response.data;
};

const sendMutualDocumentFrom = async () => {
  const user = {
    roleIndex: 1,
    signerName: 'Dinesh',
    signerEmail: 'dineshiyyandhurai@gmail.com',
  };

  const response = await axios.post(
    `${config.boldsign.host}/v1/template/send`,
    {
      roles: [user],
      disableEmails: true,
      brandId: '24f92e35-a779-4418-8e1b-54d0ca85ecc0',
    },
    {
      params: {
        templateId: '09f30ab8-07f1-4af1-9e85-2060075a269b',
      },
      headers: {
        accept: 'application/json',
        'X-API-KEY': config.boldsign.key,
        'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
      },
    }
  );

  const { signerDetails } = response.data;

  const documentId = response.data?.documentId;

  const embeddedSignLinkResponse = await axios.get(
    `${config.boldsign.host}/v1/document/getEmbeddedSignLink?documentId=${documentId}&signerEmail=${user.signerEmail}&redirectUrl=${config.website.host}/e-sign/complete`,
    {
      headers: {
        accept: 'application/json',
        'X-API-KEY': config.boldsign.key,
        'Content-Type': 'application/json;odata.metadata=minimal;odata.streaming=true',
      },
    }
  );
  const signLink = embeddedSignLinkResponse.data?.signLink;

  const data = {
    from: 'Vakilsearch <doc@esign-inc.vakilsearch.com>',
    to: user.signerEmail,
    subject: 'Review and Sign Document - Vakilsearch',
    html: templates.signTemplate({
      signLink: `${config.website.host}/e-sign/?${signLink.split('?')[1]}}`,
      user,
      signerDetails,
    }),
  };

  mailgun.messages().send(data, (error, body) => {
    if (error) {
      logger.error(error);
    } else {
      logger.debug('Email sent successfully:', body);
    }
  });

  return response.data;
};

module.exports = {
  sendDocumentFromTamplate,
  sendDocumentFromFile,
  sendMutualDocumentFrom,
};
