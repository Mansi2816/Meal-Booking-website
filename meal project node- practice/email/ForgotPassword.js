const nodemailer = require('nodemailer');

const ForgotPassworEmail = async (firstName, lastName, email, ResetToken) => {
  try {
    let testAccount = await nodemailer.createTestAccount();

    // Create a transporter using SMTP
    const transporter = await nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "b75dee2c36d5d9",
        pass: "0cc2c0be09d7db"
      }
    });

    const resetPasswordLink = `localhost:3000/reserpassword?token=${ResetToken}`;

const emailText = `
Dear ${firstName} ${lastName},

We recently received a request to reset your password for your [Your Website/Application Name] account. To initiate the password reset process, please click on the following link:

${resetPasswordLink}
          
Regards,
Rishabh Software
`;

    // Define the email message
    const mailOptions = {
      from: 'b75dee2c36d5d9',
      to: email,
      subject: 'Reset Your Password',
      text: emailText
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = ForgotPassworEmail;