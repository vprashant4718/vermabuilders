import nodemailer from 'nodemailer';
import { emailTemplate } from './emailTemplate.js';


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "vermabuilders07@gmail.com",
    pass: "ncxm dotx pxkd zefm",
  },
});

// async..await is not allowed in global scope, must use a wrapper
export const Verification =Math.floor(100000 + Math.random() * 900000);
export const OtpMail = async(email) =>{
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Verma Builders👻" <vermabuilders07@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Verification Otp", // Subject line
    text: "otp for ", // plain text body
    html: emailTemplate.replace('{verificationcode}', Verification), // html body
  });

  // console.log("Message sent: %s", info.messageId);
  // return Verification;  
}

export default OtpMail;
