import nodemailer from 'nodemailer';

const sendResetPasswordEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'leviettrung477@gmail.com',
      pass: 'imbq wdbj gzwz nyfa', // Use the generated app password here
    },
  });

  const mailOptions = {
    from: 'Your Name <leviettrung477@gmail.com>',
    to,
    subject,
    html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending email', error);
  }
}

export default sendResetPasswordEmail;
