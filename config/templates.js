const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

let transporter = nodemailer.createTransport(smtpTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
}));

module.exports.messageTemplate =
  "Your One Time Password is: {{otp}}. This Code is valid only for 10 Minutes. Do not give this code to anyone, even if they say they are from Shopkart Inc.! \n\nIf you didn't request this code, simply ignore this message.\n\nThanks,\nTeam Shopkart Inc.";

module.exports.email1 = async (_id, name, email, token) => {
  const message = `<center style="min-width:580px;width:100%">
  <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="50" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:100px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Almost done, <strong style="color:#24292e!important">${name}</strong>! To complete your <strong>Shopkart Inc.</strong> sign up, we just need to verify your email address: <strong style="color:#24292e!important">${email}</strong>.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://shopkart-inc.herokuapp.com/api/users/verifyEmail/${email}/${token}'>Verify Your Email Address</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Once verified, you can start using all of Shopkart's features to explore the mall and products and all of this at just one click.</p>
  <br>
  <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://shopkart-inc.herokuapp.com/api/users/verifyEmail/${email}/${token}</p>
  <br>
  <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">If it's not you registering with us then follow this link: https://shopkart-inc.herokuapp.com/api/users/delete/${_id}/${email}</p>
  <br>
  <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You’re receiving this email because you recently created a new Shopkart Inc. account or added a new email address. If this wasn’t you, please ignore this email.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Shopkart Inc.</strong></div>`;
  let mailOptions = {
    from: `SHOPKART INC. <${process.env.email}>`,
    to: email,
    subject: "Please Verify your E-mail Address",
    html: message,
    attachments: [
      {
        filename: "Shopkart.png",
        path: __dirname + "/assets/Shopkart.png",
        cid: "unique"
      }
    ]
  };
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return 0;
    }
    console.log("Message sent: %s", info.messageId);
  });
};

module.exports.email2 = async (_id, name, email, password) => {
  const message = `<center style="min-width:580px;width:100%">
      <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:100px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Lost Your Password, <strong style="color:#24292e!important">${name}</strong>! To change your <strong>Shopkart Inc.</strong> profile password, we just need to verify that it's you: <strong style="color:#24292e!important">${email}</strong>.<br><br><br>You can login now using your temporary password as mentioned below.</p><br><br>
      Password: <strong style="color:#24292e!important">${password}</strong>
      <br><br><br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">If it's not you changing your password then follow this link: https://shopkart-inc.herokuapp.com/api/users/delete/${_id}/${email}</p>
      <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You’re receiving this email because you forget your Shopkart Inc. account's password. If this wasn’t you, please ignore this email.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Shopkart Inc.</strong></div>`;
  let mailOptions = {
    from: `SHOPKART INC. <${process.env.email}>`,
    to: email,
    subject: "Reset Your Password",
    html: message,
    attachments: [
      {
        filename: "Shopkart.png",
        path: __dirname + "/assets/Shopkart.png",
        cid: "unique"
      }
    ]
  };
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return 0;
    }
    console.log("Message sent: %s", info.messageId);
  });
};

module.exports.email3 = async (name, email) => {
  const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:100px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Your account <strong style="color:#24292e!important">${name}</strong> is being deleted! To contact our admin at <strong>Shopkart Inc.</strong> if you think it's done by them by mistake from your email address: <strong style="color:#24292e!important">${email}</strong> then click the button below.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://shopkart-inc.herokuapp.com/api/users/contact/${email}'>Contact Us</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You are banned from using all of Shopkart's features. This may be due to your activities are being flagged by our admins or you don't want to continue using our services!</p>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://shopkart-inc.herokuapp.com/api/users/contact/${email}. You’re receiving this email because your email ID was registered with us and your account is being deleted.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Shopkart Inc.</strong></div>`;
  let mailOptions = {
    from: `SHOPKART INC. <${process.env.email}>`,
    to: email,
    subject: "Your account is Deleted!",
    html: message,
    attachments: [
      {
        filename: "Shopkart.png",
        path: __dirname + "/assets/Shopkart.png",
        cid: "unique"
      }
    ]
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return 0;
    }
    console.log("Message sent: %s", info.messageId);
  });
};

module.exports.email4 = async (name, email, contact) => {
  const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:100px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Congratulations, <strong style="color:#24292e!important">${name}</strong>. You have just added a new shop with us! To verify your contact with us at <strong>Shopkart Inc.</strong> using your email address: <strong style="color:#24292e!important">${email}</strong> then click the button below.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://shopkart-inc.herokuapp.com/api/shop/verifyMobile/${contact}'>Verify Your Mobile Number</a><br><br>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://shopkart-inc.herokuapp.com/api/shop/verifyMobile/${contact}. You’re receiving this email because your email ID was registered with us and you have just registered a shop with us.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Shopkart Inc.</strong></div>`;
  let mailOptions = {
    from: `SHOPKART INC. <${process.env.email}>`,
    to: email,
    subject: "Your just have registered a shop with us!",
    html: message,
    attachments: [
      {
        filename: "Shopkart.png",
        path: __dirname + "/assets/Shopkart.png",
        cid: "unique"
      }
    ]
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return 0;
    }
    console.log("Message sent: %s", info.messageId);
  });
};

module.exports.email5 = async (name, email, contact) => {
  const message = `<center style="min-width:580px;width:100%">
    <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="500" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:100px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center><div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Congratulations, <strong style="color:#24292e!important">${name}</strong>. You have just added a new shop with us! Now you can use our services to track your stock and orders <strong>@Shopkart-Inc.</strong> using your email address: <strong style="color:#24292e!important">${email}</strong>. Just click the button below to use our services.<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://shopkart-inc.herokuapp.com'>Shopkart Inc.</a><br><br>
    <br>
      <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://shopkart-inc.herokuapp.com. You’re receiving this email because your email ID was registered with us and you have just registered a shop with us.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Shopkart Inc.</strong></div>`;
  let mailOptions = {
    from: `SHOPKART INC. <${process.env.email}>`,
    to: email,
    subject: "Your just have registered a shop with us!",
    html: message,
    attachments: [
      {
        filename: "Shopkart.png",
        path: __dirname + "/assets/Shopkart.png",
        cid: "unique"
      }
    ]
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return 0;
    }
    console.log("Message sent: %s", info.messageId);
  });
};

module.exports.email6 = async (_id, name, email, contact, password, token) => {
  const message = `<center style="min-width:580px;width:100%">
  <div style="margin-bottom:30px;margin-top:20px;text-align:center!important" align="center !important"><img src="cid:unique" width="50" height="50" style="clear:both;display:block;float:none;height:100px;margin:0 auto;max-height:100px;max-width:100px;outline:none;text-decoration:none;width:500px" align="none" class="CToWUd"></div></center>
  <div style="box-sizing:border-box;display:block;margin:0 auto;max-width:580px"><h1 style="color:#586069;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:16px;font-weight:250!important;line-height:1.25;margin:0 0 30px;padding:0;text-align:left;word-break:normal">Hi, <strong style="color:#24292e!important">${name}</strong>! Congratulations, your profile has been created at <strong>Shopkart Inc.</strong> by your manager. We have already sent you the details to verify your email address <strong style="color:#24292e!important">${email}</strong> and OTP on your mobile no.<strong style="color:#24292e!important">${contact}</strong>. In case you haven't recieved the verification mail from us, you can click on the button below to verify or email address:<br><br><br><a style="background:#0366d6;border-radius:5px;border:1px solid #0366d6;box-sizing:border-box;color:#ffffff;display:inline-block;font-size:14px;font-weight:bold;margin:0;padding:10px 20px;text-decoration:none" href='https://shopkart-inc.herokuapp.com/api/users/verifyEmail/${email}/${token}'>Verify Your Email Address</a><br><br><br><p style="color:#222222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Once verified, you can start using all of Shopkart's features and start adding products and all of this at just one click.</p>
  <br>
  <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Button not working? Paste the following link into your browser: https://shopkart-inc.herokuapp.com/api/users/verifyEmail/${email}/${token}</p>
  <br>
  <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">Once you are done verified, you can login using your temporary password as mentioned below.</p><br>
  Password: <strong style="color:#24292e!important">${password}</strong>
  <br><br>
  <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">If it's not you registering with us then follow this link: https://shopkart-inc.herokuapp.com/api/users/delete/${_id}/${email}</p>
  <br>
  <p style="color:#586069!important;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size:14px!important;font-weight:normal;line-height:1.25;margin:0 0 15px;padding:0;text-align:left">You’re receiving this email because you profile has recently been created by your manager at Shopkart Inc.. If this wasn’t you, please ignore this email.<br><br><strong>Note:</strong> Do not reply to this email. This is auto generated email message. Thank you!</p><br>Thanks,<br>Team <strong>Shopkart Inc.</strong></div>`;
  let mailOptions = {
    from: `SHOPKART INC. <${process.env.email}>`,
    to: email,
    subject: "Welcome from Shopkart!",
    html: message,
    attachments: [
      {
        filename: "Shopkart.png",
        path: __dirname + "/assets/Shopkart.png",
        cid: "unique"
      }
    ]
  };
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return 0;
    }
    console.log("Message sent: %s", info.messageId);
  });
};