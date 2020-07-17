import nodemailer from 'nodemailer';


export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email) && email.length < 50;
}

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'xeexcovid@gmail.com',
    pass: 'XeexCovid@2019'
  }
});

export const sendMailConfirmation = (dest, firstName , link) => {
  const message = `<div>
                    <h2> Hi ${firstName}, </h2> 
                    <p> to validate your account click the bellow link </p>
                    <p> ${link} </p> 
                  </div>`;
  const mailOptions = {
    from: 'Node API <xeexcovid@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
    to: dest,
    subject: 'API Register mail confirmation ', // email subject
    html: message // email content in HTML
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        reject(err)
      }
      resolve(true)
    });
  });
};

export const validatePassword = (password) => password.length < 50 && password.length >= 8
export const validateFieldLength = (firstName, lastName) => lastName.length < 50 && firstName.length < 50
