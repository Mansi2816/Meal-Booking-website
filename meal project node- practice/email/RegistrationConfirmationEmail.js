const nodemailer = require('nodemailer');

const RegistrationEmail = async (firstName, lastName, email, password) => {
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

const emailText = `
Dear ${firstName} ${lastName},

We hope this email finds you well. We are pleased to inform you that your registration for meal booking has been successfully processed.  
      
To access the meal booking portal, please use the following credentials:
Email address: ${email}
Password: ${password}
      
Regards,
Rishabh Software
`;

    // Define the email message
    const mailOptions = {
      from: 'b75dee2c36d5d9',
      to: email,
      subject: 'Registration confirmation',
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

module.exports = RegistrationEmail;