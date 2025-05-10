import nodemailer from 'nodemailer';
import { emailTemplate } from './emailTemplate.js';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  port: process.env.GMAIL_PORT,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export const Verification =Math.floor(100000 + Math.random() * 900000).toString();
export const OtpMail = async(email) =>{
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Verma Builders👻" <${process.env.GMAIL}>`, // sender address
    to: email, // list of receivers
    subject: "Verification Otp", // Subject line
    text: "otp for ", // plain text body
    html: emailTemplate.replace('{verificationcode}', Verification), // html body
  });

  // console.log("Message sent: %s", info.messageId);
  // return Verification;  
}

export default OtpMail;
