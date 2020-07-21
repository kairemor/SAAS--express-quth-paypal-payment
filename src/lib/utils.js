import nodemailer from 'nodemailer';
import { google } from "googleapis";
const OAuth2 = google.auth.OAuth2;

import { getToken } from '../lib/authenticate';

// 

const oauth2Client = new OAuth2(
  "348561081642-0hqt0s7iqr8veobhq5gj35b425ccv5g4.apps.googleusercontent.com", // ClientID
  "BQIpGMZlOUSGEoSVuch-ukGk", // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: "1//04m7su3tcMoBLCgYIARAAGAQSNwF-L9IrbVVs4NqWH8fJU2RxI8o7g18587Z-pp6_j9DTgjO9ekmGkPk3jL0jyxxrk68geXL6qxg"
});
const accessToken = oauth2Client.getAccessToken()


/*
`Check  if the email registration is in the right email way
*/ 
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email) && email.length < 50;
}

/*
  transporter that send email 
*/
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "xeexcovid@gmail.com", 
    clientId: "348561081642-0hqt0s7iqr8veobhq5gj35b425ccv5g4.apps.googleusercontent.com",
    clientSecret: "BQIpGMZlOUSGEoSVuch-ukGk",
    refreshToken: "1//04m7su3tcMoBLCgYIARAAGAQSNwF-L9IrbVVs4NqWH8fJU2RxI8o7g18587Z-pp6_j9DTgjO9ekmGkPk3jL0jyxxrk68geXL6qxg",
    accessToken: accessToken
  } 
});

/*
  Send email giving destination the subject and the message to send 
*/
export const sendMail = (dest, subject, message) => {
  const mailOptions = {
    from: 'Node API <xeexcovid@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
    to: dest,
    subject: subject, // email subject
    html: message // email content in HTML
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("err mail send", err);
        reject(err)
      }
      console.log("mail send")
      resolve(true)
    });
  });
}

/*
  The email with link to send when the user register 
*/

export const sendMailConfirmation = async (dest, firstName , link) => {
  const message = `<div>
                    <h2> Hi ${firstName}, </h2> 
                    <p> to validate your account click the bellow  <a href=${link}>link</a></p>
                    <a href=${link}> click hear </a> 
                  </div>`;
  const subject = 'API Register mail confirmation';
  await sendMail(dest, subject, message)
};

/*
  The reset password email 
*/
export const sendResetPassword = async (dest, firstName, link) => {
  const message = `<div>
                    <h2> Hi ${firstName}, </h2> 
                    <p> to reset your password click <a href=${link}>link</a></p>
                    <a href=${link}> click hear </a> 
                  </div>`;
  const subject = 'Password Reset';
  await sendMail(dest, subject, message)
}

/*
  Validate password length 
*/

export const validatePassword = (password) => password.length < 50 && password.length >= 8

/*
  Validate firstName and lastName length
*/

export const validateFieldLength = (firstName, lastName) => lastName.length < 50 && firstName.length < 50


/*
  Get the link to send for account validation
  from protocol  host and token 
*/
export const getValidationLink = (req, user) => {
  const protocole = req.protocol
  const host = req.get('host')
  const token = getToken(user)
  const link = `${protocole}://${host}/api/v1/auth/validate/?key=${token}`
  return link
}

/*
  Get the link to send when user ask for reset password 
*/
export const resetPasswordLink = (req, user) => {
  const protocole = req.protocol
  const host = req.get('host')
  const token = getToken(user)
  const link = `${protocole}://${host}/api/v1/auth/reset-password/?key=${token}`
  return link
}
