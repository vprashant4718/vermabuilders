import nodemailer from 'nodemailer';
import { emailTemplate, ContactTemplate } from './emailTemplate.js'; // Assuming you have both templates
import dotenv from 'dotenv';
dotenv.config();

// Configure transporter
const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  port: process.env.GMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// 🔐 OTP Verification Mail
export const Verification = Math.floor(100000 + Math.random() * 900000).toString();

const OtpMail = async (email) => {
  const info = await transporter.sendMail({
    from: `"Verma Builders🏢" <${process.env.GMAIL}>`,
    to: email,
    subject: 'Verification OTP',
    text: 'Your verification code is below.',
    html: emailTemplate.replace('{verificationcode}', Verification),
  });
};

// 📩 Contact Form Mail
export const ContactMail = async (email, name, phone, message) => {
  const html = ContactTemplate
    .replace('{name}', name)
    .replace('{email}', email)
    .replace('{phone}', phone)
    .replace('{description}', message);

  const info = await transporter.sendMail({
    from: `"Verma Builders🏢" <${process.env.GMAIL}>`,
    to: email,
    subject: 'New Contact From Your Listing',
    html: html,
  });
};


export default OtpMail;
