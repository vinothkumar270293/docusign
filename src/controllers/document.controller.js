const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const baseDir = path.resolve(__dirname, '..');

const config = require('../config/config');
const catchAsync = require('../utils/catchAsync');
const { documentService } = require('../services');

const getDocuments = catchAsync(async (req, res) => {
  const response = await axios.get(`${config.boldsign.host}/v1/document/list`, {
    // params: {
    //     'PageSize': '10',
    //     'Page': '1'
    // },
    headers: {
      accept: 'application/json',
      'X-API-KEY': config.boldsign.key,
    },
  });

  res.json({ status: true, message: response.data });
});

const sendDocumentFromTamplate = catchAsync(async (req, res) => {
    const data = await documentService.sendDocumentFromTamplate();
    res.json({ status: true, data });
});

const sendDocumentFromFile = catchAsync(async (req, res) => {
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
  data.append('CC[0].EmailAddress', 'user@gmail.com');
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

  res.json({ status: true, data: response.data });
});

module.exports = {
  getDocuments,
  sendDocument: sendDocumentFromTamplate,
  sendDocumentFromFile,
};
