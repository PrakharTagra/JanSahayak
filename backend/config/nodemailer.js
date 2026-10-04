const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, ''), // strip any whitespace from app password
  },
  connectionTimeout: 5000, // 5s timeout to prevent hanging on cloud firewalls
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

const sendMail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS is not configured in environment variables.");
  }
  await transporter.sendMail({
    from: `"JanSahayak" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendMail;