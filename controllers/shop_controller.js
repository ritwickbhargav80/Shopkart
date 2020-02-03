const jwt = require("jsonwebtoken");
require("dotenv").config();
const Shop = require("../models/Shop");
const User = require("../models/User");
const SendOtp = require("sendotp");

let { messageTemplate, email4 } = require("../config/templates");

const sendOtp = new SendOtp(process.env.MSG91_API_KEY, messageTemplate);

sendOtpToMobile = async (req, res) => {
  let shop = req;
  temp = 1;
  await sendOtp.send(shop.contact, "Shopkart", (err, data) => {
    if (data.type === "error") temp1 = 0;
    else {
      shop.otpExpiresIn = Date.now() + 600000;
      shop.save();
      sendOtp.setOtpExpiry("10"); //in minutes
    }
  });
}

sendShopAddedEmail = async (req, res) => {
  let user = await User.findOne({ email: req.email });
  if (user) {
    await email4(user.name, req.email, req.contact);
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

module.exports.register = async (req, res) => {
  const token = req.header("x-auth-token");
  const decodedPayload = jwt.verify(token, process.env.SECRET);
  req.user = decodedPayload;
  let { shopName, description, contact, line1, line2, city, state, pincode } = req.body;
  var line;
  if (line2 === "") line = line1;
  else if (line1 === "") line = line2;
  else line = line1 + " " + line2;
  if (!shopName || !description || !contact || !line || !city || !state || !pincode)
    return res.status(400).json({ message: "All fields are mandatory!" });
  let pincodeRegex = /^[1-9][0-9]{5}$/;
  if (pincodeRegex.test(pincode)) {
    let shop = await Shop.findOne({ shopName: shopName, contact: contact, pincode: pincode });
    if (shop) {
      return res
        .status(400)
        .json({ message: "Your Shop is already registered with us!" });
    } else {
      let newShop = {
        shopName,
        description,
        contact,
        address: {
          line1,
          line2,
          city,
          state,
          pincode
        }
      };
      shop = await Shop.create(newShop);
      temp1 = 1;
      try {
        let here = { email: req.user.data.email, contact: shop.contact };
        await sendShopAddedEmail(here);
      } catch (err) {
        console.log(err);
      }
      try {
        await sendOtpToMobile(shop);
      } catch (err) {
        console.log(err);
      }
      if (temp1 === 0) {
        return res.status(400).json({
          success: false,
          message: "Registeration Successful!",
          error: "OTP cannot be sent. Login to recieve!"
        });
      }
      else {
        res.status(200).json({
          success: true,
          message:
            "Registeration Successful! Verify Your Mobile Number of Shop!"
        });
      }
    }
  }
  else {
    return res.status(400).json({ message: "Pincode is incorrect!" })
  }
};