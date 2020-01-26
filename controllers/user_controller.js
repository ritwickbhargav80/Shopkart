const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");
const cloudinary = require('cloudinary');
const imgUpload = require('../config/imgUpload');
const User = require("../models/User");
const SendOtp = require("sendotp");

var temp = 1;

let {
  messageTemplate,
  email1,
} = require("../config/templates");

const sendOtp = new SendOtp(process.env.MSG91_API_KEY, messageTemplate);

sendVerificationLink = async (req, res) => {
  let email = req;
  let user = await User.findOne({ email });
  if (user) {
    if (user.isEmailVerified === true) {
      return res.status(400).json({ message: "Already Verified!" });
    } else {
      let token = Date.now() + user._id + Math.random(10000000000);
      user.verifyEmail.token = token;
      user.verifyEmail.expiresIn = Date.now() + 3600000;
      await user.save();
      await email1(user._id, user.name, email, token);
    }
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

sendOtpToMobile = async (req, res) => {
  let user = req;
  debugger
  temp = 1;
  await sendOtp.send(user.contact, "Shopkart", (err, data) => {
    if (data.type === "error") temp1 = 0;
    else {
      user.otpExpiresIn = Date.now() + 600000;
      user.save();
      sendOtp.setOtpExpiry("10"); //in minutes
    }
  });
}

module.exports.register = async (req, res) => {
  let { firstName, lastName, email, contact, password, confirmPassword, role } = req.body;
  var name;
  if (lastName === "") name = firstName;
  else name = firstName + " " + lastName;
  if (!name || !email || !contact || !password || !role)
    return res.status(400).json({ message: "All fields are mandatory!" });
  let emailRegex = /^\S+@\S+\.\S+/,
    phoneRegex = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/,
    passwordRegex = /^[\S]{8,}/;
  if (emailRegex.test(email)) {
    if (passwordRegex.test(String(password))) {
      if (phoneRegex.test(Number(contact))) {
        let user =
          (await User.findOne({ email })) || (await User.findOne({ contact }));
        if (user) {
          return res
            .status(400)
            .json({ message: "Email or Contact already registered with us!" });
        } else {
          let newUser = {
            name,
            email,
            password,
            role,
            contact
          };
          const salt = await bcrypt.genSalt(10);
          newUser.password = await bcrypt.hash(newUser.password, salt);
          user = await User.create(newUser);
          (temp = 1), (temp1 = 1);
          try {
            await sendVerificationLink(newUser.email);
          } catch (err) {
            temp = 0;
            console.log(err);
          }
          try {
            debugger
            await sendOtpToMobile(user);
          } catch (err) {
            console.log(err);
          }
          if (temp === 0) {
            return res.status(400).json({
              success: false,
              message: "Registeration Successful!",
              error: "Verification Email cannot be sent. Login to recieve!"
            });
          } else if (temp1 === 0) {
            return res.status(400).json({
              success: false,
              message: "Registeration Successful!",
              error: "OTP cannot be sent. Login to recieve!"
            });
          } else if (temp === 0 && temp1 === 0) {
            return res.status(400).json({
              success: false,
              message: "Registeration Successful!",
              error:
                "Verification Email & OTP cannot be sent. Login to recieve!"
            });
          } else {
            res.status(200).json({
              success: true,
              message:
                "Registeration Successful! Verify Your Email Address & Mobile Number!"
            });
          }
        }
      } else {
        return res.status(400).json({ message: "Contact number not valid!" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters long!" });
    }
  } else {
    return res.status(400).json({ message: "EmailID is not valid!" });
  }
};

module.exports.login = async (req, res) => {
  let { email, mobile, password } = req.body;
  var user;
  user =
    (await User.findOne({ email: email })) ||
    (await User.findOne({ contact: mobile }));
  if (!user) {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Wrong Credentials!" });
  } else if (
    isMatch &&
    user.isEmailVerified === false &&
    user.isContactVerified === false
  ) {
    if (
      user.verifyEmail.expiresIn >= Date.now() &&
      user.otpExpiresIn >= Date.now()
    ) {
      return res.status(401).json({
        success: false,
        message: "Verify your EmailID & your Mobile Number!"
      });
    } else if (user.verifyEmail.expiresIn < Date.now()) {
      await sendVerificationLink(user.email);
      return res.status(401).json({
        success: false,
        message: "Verify your EmailID Now!"
      });
    } else if (user.otpExpiresIn < Date.now()) {
      await sendOtpToMobile(user);
      return res.status(401).json({
        success: false,
        message: "Verify your Mobile No. Now!"
      });
    } else {
      await sendVerificationLink(user.email);
      await sendOtpToMobile(user);
      return res.status(401).json({
        success: false,
        message: "Verify your EmailID & your Mobile Number now!"
      });
    }
  } else if (isMatch && user.isContactVerified === false) {
    if (user.otpExpiresIn >= Date.now()) {
      return res
        .status(401)
        .json({ success: false, message: "Verify your Mobile No.!" });
    } else {
      await sendOtpToMobile(user);
      return res
        .status(401)
        .json({ success: false, message: "Verify your Mobile No. now!" });
    }
  } else if (isMatch && user.isEmailVerified === false) {
    if (user.verifyEmail.expiresIn >= Date.now()) {
      return res
        .status(401)
        .json({ success: false, message: "Verify your EmailID!" });
    } else {
      await sendVerificationLink(user.email);
      return res
        .status(401)
        .json({ success: false, message: "Verify your EmailID now!" });
    }
  } else {
    if (user.resetPwd.token) {
      user.resetPwd.token = undefined;
      user.resetPwd.expiresIn = undefined;
      user.save();
    }
    if (!user.qrcode.id) {
      let user1 = {
        name,
        email,
        role,
        contact
      };
      user1.name = newUser.name;
      user1.email = newUser.email;
      user1.role = newUser.role;
      user1.contact = newUser.contact;
      let JSONobject = JSON.stringify(user1);
      var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        quality: 1,
        margin: 1
      }
      qrcode.toDataURL(JSONobject, opts)
        .then(url => {
          cloudinary.uploader.upload(url, (result, error) => {
            if (result) {
              user.qrcode.id = result.public_id;
              user.qrcode.url = result.url;
              user.save();
            } else if (error) {
              console.log("QR Code is not Uploaded!");
            }
          });
        })
        .catch(err => {
          console.error(err)
        })
    }
    const token = jwt.sign(
      {
        type: "user",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          contact: user.contact,
          role: user.role,
          qrcode_url: user.qrcode.url
        }
      },
      process.env.secret,
      {
        expiresIn: 604800 // for 1 week time in milliseconds
      }
    );
    return res
      .header("x-auth-token", token)
      .status(200)
      .json({ success: true, message: "Logged In!", token: token });
  }
};