const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const qrcode = require("qrcode");
const cloudinary = require('cloudinary');
const imgUpload = require('../config/imgUpload');
const User = require("../models/User");
const SendOtp = require("sendotp");
const axios = require("axios");

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
  debugger
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
        name: undefined,
        email: undefined,
        role: undefined,
        contact: undefined
      };
      user1.name = user.name;
      user1.email = user.email;
      user1.role = user.role;
      user1.contact = user.contact;
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

module.exports.verifyEmail = async (req, res) => {
  let { email, token } = req.params;
  let user = await User.findOne({ email: email });
  if (user) {
    if (user.isEmailVerified === true && user.isContactVerified === true) {
      if (!user.qrcode.id) {
        let user1 = {
          name: undefined,
          email: undefined,
          role: undefined,
          contact: undefined
        };
        user1.name = user.name;
        user1.email = user.email;
        user1.role = user.role;
        user1.contact = user.contact;
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
            role: user.role
          }
        },
        process.env.secret,
        {
          expiresIn: 604800 // for 1 week time in milliseconds
        }
      );
      res
        .header("x-auth-token", token)
        .status(200)
        .json({ success: true, message: "Already Verified" });
    } else if (
      user.isEmailVerified === true &&
      user.isContactVerified === false
    ) {
      if (user.otpExpiresIn >= Date.now())
        res.status(200).json({
          success: true,
          message: "Already Verified! Verify your Mobile No."
        });
      else {
        await sendOtpToMobile(user);
        res.status(200).json({
          success: true,
          message: "Already Verified! Verify your Mobile No. Now"
        });
      }
    } else if (
      user.verifyEmail.expiresIn >= Date.now() &&
      user.verifyEmail.token === token &&
      user.isContactVerified === true
    ) {
      user.isEmailVerified = true;
      user.verifyEmail.token = undefined;
      user.verifyEmail.expiresIn = undefined;
      await user.save();
      if (!user.qrcode.id) {
        let user1 = {
          name: undefined,
          email: undefined,
          role: undefined,
          contact: undefined
        };
        user1.name = user.name;
        user1.email = user.email;
        user1.role = user.role;
        user1.contact = user.contact;
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
            role: user.role
          }
        },
        process.env.secret,
        {
          expiresIn: 604800 // for 1 week time in milliseconds
        }
      );
      res
        .header("x-auth-token", token)
        .status(200)
        .json({
          success: true,
          message: "Email Verified! You can login now!",
          token: token
        });
    } else if (
      user.verifyEmail.expiresIn >= Date.now() &&
      user.verifyEmail.token === token &&
      user.isContactVerified === false
    ) {
      user.isEmailVerified = true;
      user.verifyEmail.token = undefined;
      user.verifyEmail.expiresIn = undefined;
      await user.save();
      if (user.otpExpiresIn >= Date.now()) {
        res.status(200).json({
          success: true,
          message: "Email Verified! Verify your Mobile no.!"
        });
      } else {
        await sendOtpToMobile(user);
        res.status(200).json({
          success: true,
          message: "Email Verified! Verify your Mobile no. now!"
        });
      }
    } else {
      await sendVerificationLink(user.email);
      res.status(400).json({ message: "Invalid Request or Link Expired!" });
    }
  } else {
    res.status(400).json({ message: "No User Found" });
  }
};

module.exports.verifyContact = async (req, res) => {
  let { contact } = req.params;
  let { otp } = req.body;
  let user = await User.findOne({ contact: contact });
  if (user) {
    if (user.isContactVerified === true && user.isEmailVerified === true) {
      if (!user.qrcode.id) {
        var user1 = {
          name,
          email,
          role,
          contact
        };
        user1.name = user.name;
        user1.email = user.email;
        user1.role = user.role;
        user1.contact = user.contact;
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
            role: user.role
          }
        },
        process.env.secret,
        {
          expiresIn: 604800 // for 1 week time in milliseconds
        }
      );
      res
        .header("x-auth-token", token)
        .status(200)
        .json({ success: true, message: "Already Verified!" });
    } else if (
      user.isContactVerified === true &&
      user.isEmailVerified === false
    ) {
      if (user.verifyEmail.expiresIn >= Date.now())
        res.status(200).json({
          success: true,
          message: "Already Verified! Verify your email Id."
        });
      else {
        await sendVerificationLink(user.email);
        res.status(200).json({
          success: true,
          message: "Already Verified! Verify your email Id now."
        });
      }
    } else {
      await sendOtp.verify(contact, otp, async (error, data) => {
        console.log(data);
        if (data.type == "success") {
          if (
            user.otpExpiresIn >= Date.now() &&
            user.isEmailVerified === true
          ) {
            user.isContactVerified = true;
            user.otpExpiresIn = undefined;
            await user.save();
            if (!user.qrcode.id) {
              let user1 = {
                name,
                email,
                role,
                contact
              };
              user1.name = user.name;
              user1.email = user.email;
              user1.role = user.role;
              user1.contact = user.contact;
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
                  role: user.role
                }
              },
              process.env.secret,
              {
                expiresIn: 604800 // for 1 week time in milliseconds
              }
            );
            res
              .header("x-auth-token", token)
              .status(200)
              .json({
                success: true,
                message: "Contact Verified. You can login now!",
                token: token
              });
          } else if (
            user.otpExpiresIn >= Date.now() &&
            user.isEmailVerified === false
          ) {
            user.isContactVerified = true;
            user.otpExpiresIn = undefined;
            await user.save();
            if (user.verifyEmail.expiresIn >= Date.now()) {
              res.status(200).json({
                success: true,
                message: "Contact Verified. Need to verify your Email!"
              });
            } else {
              await sendVerificationLink(user.email);
              res.status(200).json({
                success: true,
                message: "Contact Verified. Need to verify your Email now!"
              });
            }
          }
        }
        if (data.type == "error") {
          if (user.otpExpiresIn < Date.now())
            await sendOtpToMobile(user);
          res.status(400).json({ message: "Invalid Request or Link Expired!" });
        }
      });
    }
  } else {
    res.status(400).json({ message: "No User Found" });
  }
};

module.exports.retryContactVerification = async (req, res) => {
  let { contact } = req.params;
  let user = await User.findOne({ contact: contact });
  if (user) {
    if (user.isContactVerified === true && user.isEmailVerified === true) {
      if (!user.qrcode.id) {
        let user1 = {
          name,
          email,
          role,
          contact
        };
        user1.name = user.name;
        user1.email = user.email;
        user1.role = user.role;
        user1.contact = user.contact;
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
            role: user.role
          }
        },
        process.env.secret,
        {
          expiresIn: 604800 // for 1 week time in milliseconds
        }
      );
      res
        .header("x-auth-token", token)
        .status(200)
        .json({
          success: true,
          message: "Already Verified!",
          token: token
        });
    } else if (user.isContactVerified === true) {
      if (user.verifyEmail.expiresIn >= Date.now())
        res.status(200).json({
          success: true,
          message: "Contact Already Verified! Need to verify Email Id."
        });
      else {
        sendVerificationLink(user.email);
        res.status(200).json({
          success: true,
          message: "Contact Already Verified! Need to verify Email Id now."
        });
      }
    } else {
      let response = await axios.post(
        `${process.env.MSG91_RESENDOTP_URL}${contact}&authkey=${process.env.MSG91_API_KEY}`
      );
      console.log(response);
      if (
        response.data.type === "error" &&
        response.data.message === "No OTP request found to retryotp"
      ) {
        res
          .status(400)
          .json({ message: "Can't retry OTP without trying Verification" });
      } else if (
        response.data.type === "success" &&
        user.isEmailVerified === false
      ) {
        if (user.verifyEmail.expiresIn >= Date.now())
          res.status(200).json({
            success: true,
            message: "Called! Need to verify Email Id."
          });
        else if (response.data.type === "success") {
          sendVerificationLink(user.email);
          res.status(200).json({
            success: true,
            message: "Called! Need to verify Email Id now."
          });
        }
      } else if (response.data.type === "error") {
        res.status(400).json({ message: "OTP not sent" });
      } else {
        res.status(200).json({
          success: true,
          message: "Otp Send via call."
        });
      }
    }
  } else {
    res.status(400).json({ message: "No User Found" });
  }
};

module.exports.profile = async (req, res) => {
  let user = await User.findById(req.user.data._id);
  id = user._id;
  isEmailVerified = user.isEmailVerified;
  isContactVerified = user.isContactVerified;
  name = user.name;
  email = user.email;
  contact = user.contact;
  role = user.role;
  qrcode = user.qrcode.url;
  return res.status(200).json({
    _id: id,
    isEmailVerified: isEmailVerified,
    isContactVerified: isContactVerified,
    name: name,
    email: email,
    contact: contact,
    role: role,
    qrcode: qrcode
  });
};