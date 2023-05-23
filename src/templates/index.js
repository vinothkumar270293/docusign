const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const signFile = fs.readFileSync(path.join(__dirname,'review_and_sign.hbs'), 'utf8');
const signTemplate = Handlebars.compile(signFile);

const signedDocumentFile = fs.readFileSync(path.join(__dirname,'signed_document.hbs'), 'utf8');
const signedDocumentTemplate = Handlebars.compile(signedDocumentFile);

module.exports = {
    signTemplate,
    signedDocumentTemplate
}
