const axios = require('axios');

const mailgun = require('../config/emailer');
const config = require('../config/config');
const templates = require('../templates');

const sendSignedEmail = async ({ data }) => {
  const response = await axios.get(`${config.boldsign.host}/v1/document/download?documentId=${data.documentId}`, {
    headers: {
      'X-API-KEY': config.boldsign.key,
    },
    responseType: 'arraybuffer', // Set the response type to arraybuffer to receive binary data
  });

  const signedDocumentData = response.data;

  const requestData = {
    from: 'Vakilsearch <doc@esign-inc.vakilsearch.com>',
    to: data.signerDetails[0].signerEmail,
    subject: 'You have successfully signed Commercial Agreement - Vakilsearch',
    html: `<table
                    align="center"
                    bgcolor="#F7FAFC"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    height="100%"
                    style="border-collapse: collapse"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td align="center" height="20" valign="top"></td>
                      </tr>
                      <tr>
                        <td align="center" valign="top" width="550" style="padding: 0 16px">
                          <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width: 550px; border-collapse: collapse">
                            <tbody>
                              <tr>
                                <td align="center" bgcolor="#FFFFFF" style="max-width: 550px" valign="top" width="550">
                                  <table
                                    align="center"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="border-collapse: collapse"
                                    width="100%"
                                  >
                                    <tbody>
                                      <tr>
                                        <td align="center" bgcolor="#F7FAFC" valign="top">
                                          <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            style="border-collapse: collapse"
                                            width="100%"
                                          >
                                            <tbody>
                                              <tr>
                                                <td height="20" valign="top"></td>
                                              </tr>
                                              <tr>
                                                <td valign="top">
                                                  <table
                                                    border="0"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    style="border-collapse: collapse"
                                                    width="105"
                                                  >
                                                    <tbody>
                                                      <tr>
                                                        <td>
                                                          <a
                                                            href="https://vakilsearch.com"
                                                            style="
                                                              color: #333333;
                                                              text-decoration: none;
                                                              height: 32px;
                                                              width: 150px;
                                                              display: block;
                                                              line-height: 32px;
                                                            "
                                                            target="_blank"
                                                          >
                                                            <img
                                                              height="auto"
                                                              width="150"
                                                              alt="Vakilsearch Logo"
                                                              border="0"
                                                              src="https://assets.vakilsearch.com/live-images/partnerportalassets/new/Vakilsearch.png"
                                                              style="display: inline-block; vertical-align: bottom; margin: auto"
                                                              class="CToWUd"
                                                            />
                                                          </a>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td height="18" valign="top"></td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td align="center" valign="top" style="padding: 0 5px">
                                          <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            style="border-collapse: collapse"
                                            width="85%"
                                          >
                                            <tbody>
                                              <tr>
                                                <td height="32"></td>
                                              </tr>
                                              <tr>
                                                <td valign="top">
                                                  <table
                                                    align="center"
                                                    border="0"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    style="border-collapse: collapse"
                                                    width="105"
                                                  >
                                                    <tbody>
                                                      <tr>
                                                        <td height="29" align="center">
                                                          <a href="#m_-7830485029731284496_" style="color: #0e82a9; text-decoration: none">
                                                            <img
                                                              height="60"
                                                              alt="All signers signed"
                                                              border="0"
                                                              src="https://ci6.googleusercontent.com/proxy/sUvuae33jtLuFxgMIWPXiR-nM9A8u5Vfdu9B6LiSPNDkzlS92UfnzmYLaPNd7In6sllSCb5qfcC9UZY24XZZE8F_NhiUcrb7wg=s0-d-e1-ft#https://cdn.syncfusion.com/boldsign/common/success.png"
                                                              class="CToWUd"
                                                              data-bit="iit"
                                                            />
                                                          </a>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td height="24"></td>
                                              </tr>
                                              <tr>
                                                <td align="center" valign="top">
                                                  <table
                                                    align="center"
                                                    width="90%"
                                                    border="0"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    style="border-collapse: collapse"
                                                  >
                                                    <tbody>
                                                      <tr>
                                                        <td
                                                          align="center"
                                                          style="
                                                            font-family: 'Roboto', Arial;
                                                            font-size: 16px;
                                                            text-align: center;
                                                            color: #333333;
                                                            font-weight: normal;
                                                            line-height: 24px;
                                                            letter-spacing: 0.32px;
                                                            word-break: break-word;
                                                          "
                                                          valign="top"
                                                          width="370"
                                                        >
                                                          You have successfully signed the document <b>Rental Agreement</b>. A copy of the
                                                          final document is attached to this email.
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                              <tr>
                                                <td height="24" style="font-size: 1px"></td>
                                              </tr>
                                              <tr>
                                                <td
                                                  height="1"
                                                  width="510"
                                                  style="
                                                    font-size: 1px;
                                                    line-height: 1px;
                                                    width: 100%;
                                                    max-width: 510px;
                                                    background-color: #eeeeee;
                                                  "
                                                ></td>
                                              </tr>
                                              <tr>
                                                <td height="24" style="font-size: 1px"></td>
                                              </tr>
                                              <tr>
                                                <td
                                                  style="
                                                    color: #333;
                                                    text-align: left;
                                                    font-size: 16px;
                                                    font-family: 'Roboto', Arial;
                                                    line-height: 28px;
                                                    letter-spacing: 0.32px;
                                                  "
                                                >
                                                  <span style="font-weight: bold">Signer(s):</span><br /><span
                                                    style="font-size: 14px; font-weight: 400"
                                                    ><table>
                                                      <tbody>
                                                        ${data.signerDetails.map(
                                                          (sign) => `
                                                        <tr>
                                                          <td style="padding: 10px 0px 0px 0px">
                                                            ${sign.signerName} (<a href="mailto:${sign.signerEmail}" target="_blank"
                                                              >${sign.signerEmail}</a
                                                            >)
                                                          </td>
                                                        </tr>
                                                        `
                                                        )}
                                                      </tbody>
                                                    </table></span
                                                  >
                                                </td>
                                              </tr>
                                              <tr>
                                                <td style="height: 12px"></td>
                                              </tr>
                                              <tr>
                                                <td height="12"></td>
                                              </tr>
                  
                                              <tr>
                                                <td style="display: none">
                                                  <span style="font-weight: bold"> Acknowledgement Message: </span> <br />
                                                  <pre
                                                    style="
                                                      font-weight: 400;
                                                      font-size: 14px;
                                                      margin: 0px !important;
                                                      white-space: pre-wrap !important;
                                                      font-family: 'Roboto', Arial;
                                                      display: inline-block !important;
                                                      letter-spacing: 0.32px;
                                                      line-height: 28px;
                                                      color: #333;
                                                      text-align: left;
                                                      word-break: break-word;
                                                    "
                                                  >
                  {message}</pre
                                                  >
                                                </td>
                                                <td height="16"></td>
                                              </tr>
                  
                                              <tr>
                                                <td align="center" valign="top">
                                                  <table
                                                    align="center"
                                                    border="0"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    style="border-collapse: collapse"
                                                    width="95%"
                                                  >
                                                    <tbody>
                                                      <tr>
                                                        <td height="32"></td>
                                                      </tr>
                                                      <tr>
                                                        <td align="center" valign="top">
                                                          <table
                                                            align="center"
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            style="border-collapse: collapse"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  align="center"
                                                                  height="44"
                                                                  width="190"
                                                                  style="background: #ffd000; border-radius: 4px"
                                                                >
                                                                  <a
                                                                    href="https://app.boldsign.com/document/view/?documentId=d88582eb-7d84-452b-9a61-b1dc6c6a4a0ds_k5MKT;743a1362-be1a-4000-9a9c-50cfaf950277"
                                                                    style="
                                                                      font-family: Roboto, Arial;
                                                                      font-weight: bold;
                                                                      color: black;
                                                                      text-decoration: none !important;
                                                                      background: #ffd000;
                                                                      border-radius: 4px;
                                                                      font-size: 16px;
                                                                      letter-spacing: 0.32px;
                                                                      display: inline-block;
                                                                    "
                                                                    target="_blank"
                                                                    ><span style="color: #000; text-decoration: none">View Document</span></a
                                                                  >
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td height="32"></td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" valign="top" style="padding-bottom: 40px">
                                  <table border="0" cellpadding="0" cellspacing="0" width="100%" id="m_-7830485029731284496templateFooter">
                                    <tbody>
                                      <tr>
                                        <td align="center" valign="top">
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            bgcolor="#F7FAFC"
                                            width="100%"
                                            style="display: none"
                                          >
                                            <tbody>
                                              <tr>
                                                <td valign="top" style="padding-top: 9px; padding-bottom: 9px">
                                                  <table
                                                    border="0"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    width="100%"
                                                    style="min-width: 100%; display: none"
                                                  >
                                                    <tbody>
                                                      <tr>
                                                        <td valign="top" style="padding-top: 9px">
                                                          <table
                                                            align="left"
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            style="max-width: 100%; min-width: 100%"
                                                            width="100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td valign="top" style="padding: 0px 18px 9px; line-height: 150%">
                                                                  <div style="text-align: center">
                                                                    <span style="font-size: 12px"
                                                                      ><span
                                                                        style="
                                                                          font-family: roboto, helvetica neue, helvetica, arial, sans-serif;
                                                                        "
                                                                        ><span style="color: #666e80"
                                                                          >BoldSign is an application for electronically signing documents
                                                                          online.</span
                                                                        ></span
                                                                      ></span
                                                                    >
                                                                  </div>
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%">
                                                    <tbody>
                                                      <tr>
                                                        <td valign="top" style="padding: 0px">
                                                          <table
                                                            align="left"
                                                            width="100%"
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            style="min-width: 100%"
                                                          >
                                                            <tbody>
                                                              <tr>
                                                                <td
                                                                  valign="top"
                                                                  style="
                                                                    padding-right: 0px;
                                                                    padding-left: 0px;
                                                                    padding-top: 0;
                                                                    padding-bottom: 0;
                                                                    text-align: center;
                                                                  "
                                                                >
                                                                  <img
                                                                    align="center"
                                                                    alt="BoldSign footer logo"
                                                                    src="https://ci4.googleusercontent.com/proxy/hGl2wNpp7jrKzdkyZC-T4c6rs636_tc-GNcB9eZAsQmSYFLW7kUa_tOtL7wrHUZ7ruTs0-NmSkVDJlrTc-Uxf6PnAnocOYJ4WROM=s0-d-e1-ft#https://static.boldsign.com/img/boldsign-footer-logo.png"
                                                                    style="
                                                                      width: 150px;
                                                                      padding-bottom: 0;
                                                                      display: inline !important;
                                                                      vertical-align: bottom;
                                                                    "
                                                                    class="CToWUd"
                                                                    data-bit="iit"
                                                                  />
                                                                </td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" height="20" valign="top"></td>
                      </tr>
                    </tbody>
                  </table>
                  `,
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
  const { signerDetails } = data;

  if(signerDetails.length < 2) return;

  const signedUsers = signerDetails.filter(signer => signer.status == 'Completed');

  for (let signer of signerDetails) {

    const requestConfig = {
      from: 'Vakilsearch <support@esign-inc.vakilsearch.com>',
      to: signer.signerEmail,
      subject: 'Review and Sign Document - Vakilsearch',
      html: templates.signTemplate({
        document: {...data, signerDetails: signedUsers,
          documentLink: `http://localhost:3000/e-sign/?documentId=${data.documentId}`},
        fromUser: signer,
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
