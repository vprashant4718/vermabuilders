export const emailTemplate =
`<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Verma Properties</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures.</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;" id="verification-code">{verificationcode}</h2>
    <p style="font-size:0.9em;">Regards,<br />Verma Properties</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Verma Properties pvt ltd.</p>
      <p>Jaipur Rajasthan</p>
      <p>India</p>
    </div>
  </div>
</div>`;


export const ContactTemplate =
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Contact Notification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
    }

    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    }

    .header {
      background-color: #1976d2;
      color: white;
      padding: 20px;
      text-align: center;
    }

    .header h2 {
      margin: 0;
      font-size: 24px;
    }

    .content {
      padding: 20px;
    }

    .info {
      margin-bottom: 20px;
      font-size: 16px;
      line-height: 1.6;
    }

    .info p {
      margin: 6px 0;
    }

    .label {
      font-weight: bold;
      color: #555;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #aaa;
      padding: 15px;
      border-top: 1px solid #eee;
      background-color: #fafafa;
    }

    @media (max-width: 600px) {
      .container {
        margin: 10px;
        border-radius: 6px;
      }
      .header h2 {
        font-size: 20px;
      }
      .content {
        padding: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📩 New Contact Request</h2>
    </div>

    <div class="content">
      <p>Hello,</p>
      <p>Someone is interested in one of your listed properties. Here are the contact details:</p>

      <div class="info">
        <p><span class="label">Name:</span> {name}</p>
        <p><span class="label">Email:</span> {email}</p>
        <p><span class="label">Phone:</span> {phone}</p>
      </div>

      <div class="info">
        <p><span class="label">Message:</span></p>
        <p>{description}</p>
      </div>

      <p>Please respond to them at your earliest convenience.</p>
    </div>

    <div class="footer">
      <p>This message was sent via Verma Properties 🏗️ </p>
    </div>
  </div>
</body>
</html>

`
