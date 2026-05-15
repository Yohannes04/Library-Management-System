const nodemailer = require('nodemailer');

// Set up ethereal email for testing without real credentials
let transporter;

async function createTestTransporter() {
  if (!transporter) {
    // Generate test SMTP service account from ethereal.email
    let testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
  }
  return transporter;
}

const sendVerificationEmail = async (email, token) => {
  try {
    const mailTransporter = await createTestTransporter();
    
    const verificationUrl = `http://localhost:5173/verify-email?token=${token}`;
    
    const info = await mailTransporter.sendMail({
      from: '"Lehket Library" <noreply@lehketlibrary.com>',
      to: email,
      subject: "Verify Your Email Address",
      text: `Please verify your email address by clicking the following link: ${verificationUrl}`,
      html: `<p>Please verify your email address by clicking the following link:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail
};
