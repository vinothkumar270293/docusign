const axios = require('axios');

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const commonHeaders = {
  accept: 'application/json',
  'X-API-KEY': config.boldsign.key,
};

const getTemplates = catchAsync(async (req, res) => {
  const { page = '1', size = '10' } = req.query;
  const response = await axios.get(`${config.boldsign.host}/v1/template/list`, {
    params: {
      PageSize: page,
      Page: size,
    },
    headers: commonHeaders,
  });

  res.json({ status: true, data: response.data });
});

const createTemplate = catchAsync(async (req, res) => {
  const axios = require('axios');
  const FormData = require('form-data');
  const fs = require('fs');
  const form = new FormData();
  form.append('BrandId', '');
  form.append('EnableReassign', 'true');
  form.append('AllowNewRoles', 'true');
  form.append('EnablePrintAndSign', 'false');
  form.append('DocumentMessage', 'document message for signers');
  form.append('EnableSigningOrder', 'false');
  form.append('UseTextTags', 'false');
  form.append('Files', fs.readFileSync('Bill-of-Sale.pdf;type=application/pdf'), 'Bill-of-Sale.pdf;type=application/pdf');
  form.append('Title', 'title of the template');
  form.append('AllowMessageEditing', 'true');
  form.append('Description', 'testingDescription');
  form.append('DocumentTitle', 'title of the document');
  form.append(
    'Roles',
    '{\n  "name": "Hr",\n  "index": 1,\n  "defaultSignerName": "Alex Gayle",\n  "defaultSignerEmail": "alexgayle@cubeflakes.com",\n  "signerOrder": 1,\n  "signerType": "Signer",\n  "language": 1,\n  "imposeAuthentication": "None",\n  "formFields": [\n    {\n      "id": "sign_id",\n      "name": "sign",\n      "fieldType": "Signature",\n      "pageNumber": 1,\n      "bounds": {\n        "x": 50,\n        "y": 100,\n        "width": 100,\n        "height": 60\n      },\n      "isRequired": true\n    }\n  ],\n  "allowRoleEdit": true,\n  "allowRoleDelete": true\n}'
  );
  const response = await axios.post(`${config.boldsign.host}/v1/template/create`, form, {
    headers: {
      ...commonHeaders,
      ...form.getHeaders(),
      'Content-Type': 'multipart/form-data',
    },
  });

  res.json({ status: true, data: response.data });
});

const deleteTemplate = catchAsync(async (req, res) => {
  const { id } = req.query;

  const response = await axios.delete(`${config.boldsign.host}/v1/template/delete`, {
    params: {
      templateId: id,
    },
    headers: {
      ...commonHeaders,
      accept: '*/*',
    },
  });

  res.json({ status: true, data: response.data });
});

const templateDetails = catchAsync(async (req, res) => {
  const { id } = req.query;

  const response = await axios.get(`${config.boldsign.host}/v1/template/properties`, {
    params: {
      templateId: id,
    },
    headers: commonHeaders,
  });

  res.json({ status: true, data: response.data });
});

module.exports = {
  getTemplates,
  createTemplate,
  deleteTemplate,
  templateDetails,
};
