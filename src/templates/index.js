const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const createSignFile = fs.readFileSync(path.join(__dirname, 'create_sign.html'), 'utf8');
const createSignTemplate = Handlebars.compile(createSignFile);

const signFile = fs.readFileSync(path.join(__dirname, 'review_and_sign.html'), 'utf8');
const signTemplate = Handlebars.compile(signFile);

const signedDocumentFile = fs.readFileSync(path.join(__dirname, 'signed_document.html'), 'utf8');
const signedDocumentTemplate = Handlebars.compile(signedDocumentFile);

const completedDocumentFile = fs.readFileSync(path.join(__dirname, 'document_complete.html'), 'utf8');
const completedDocumentTemplate = Handlebars.compile(completedDocumentFile);

module.exports = {
  createSignTemplate,
  signTemplate,
  signedDocumentTemplate,
  completedDocumentTemplate,
};
