const nodemailer = require('nodemailer');
const axios = require('axios');

// Standard SMTP transporter (for local dev or providers that allow SMTP ports)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, ''),
  },
  connectionTimeout: 8000,
  greetingTimeout: 8000,
  socketTimeout: 8000,
});

/**
 * Universal mail sender:
 * 1. Uses Brevo REST API (HTTPS port 443) if BREVO_API_KEY is configured (recommended for Render free tier)
 * 2. Uses Resend REST API (HTTPS port 443) if RESEND_API_KEY is configured
 * 3. Falls back to Gmail SMTP via Nodemailer
 */
const sendMail = async ({ to, subject, html }) => {
  // Option 1: Brevo HTTP API (300 free emails/day, never blocked by cloud firewalls)
  if (process.env.BREVO_API_KEY) {
    const senderEmail = process.env.EMAIL_USER || 'no-reply@jansahayak.org';
    const senderName = process.env.SENDER_NAME || 'JanSahayak';

    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    console.log(`[Brevo Email] Sent successfully to ${to}, messageId:`, response.data?.messageId);
    return response.data;
  }

  // Option 2: Resend HTTP API (3000 free emails/month, HTTPS port 443)
  if (process.env.RESEND_API_KEY) {
    const fromAddress = process.env.RESEND_FROM || 'JanSahayak <onboarding@resend.dev>';

    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: fromAddress,
        to: Array.isArray(to) ? to : [to],
        subject: subject,
        html: html,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    console.log(`[Resend Email] Sent successfully to ${to}, id:`, response.data?.id);
    return response.data;
  }

  // Option 3: Fallback to Gmail SMTP via Nodemailer
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('No email service configured. Please provide BREVO_API_KEY, RESEND_API_KEY, or EMAIL_USER & EMAIL_PASS.');
  }

  const info = await transporter.sendMail({
    from: `"JanSahayak" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
  console.log(`[Gmail SMTP] Sent successfully to ${to}, messageId:`, info.messageId);
  return info;
};

module.exports = sendMail;