const jwt = require("jsonwebtoken");
const SendOtp = require("sendotp");
const axios = require("axios");
require("dotenv").config();
const Shop = require("../models/Shop");
const User = require("../models/User");
const Product = require("../models/Products");

let { messageTemplate, email4, email5 } = require("../config/templates");

const sendOtp = new SendOtp(process.env.MSG91_API_KEY, messageTemplate);

let temp1;

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

sendShopAddedEmail1 = async (req, res) => {
  let user = await User.findOne({ email: req.email });
  if (user) {
    await email5(user.name, req.email);
  } else {
    return res.status(400).json({ success: false, message: "User not found!" });
  }
};

module.exports.register = async (req, res) => {
  const token = req.header("x-auth-token");
  const decodedPayload = jwt.verify(token, process.env.SECRET);
  req.user = decodedPayload;
  let user = await User.find({ "$or": [{ "_id": req.user.data._id }, { "admin": req.user.data._id }] });
  if (user[0].shop)
    return res
      .status(400)
      .json({ message: "Your Shop is already registered with us!" });
  let { shopName, description, contact, line1, line2, city, state, pincode } = req.body;
  var line;
  if (line2 === "") line = line1;
  else if (line1 === "") line = line2;
  else line = line1 + " " + line2;
  if (!shopName || !description || !contact || !line || !city || !state || !pincode)
    return res.status(400).json({ message: "All fields are mandatory!" });
  let pincodeRegex = /^[1-9][0-9]{5}$/;
  if (pincodeRegex.test(pincode)) {
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
    for (var i = 0; i < user.length; i++) {
      user[i].shop = shop._id;
      user[i].save();
    }
    temp1 = 1;
    try {
      let here = { email: req.user.data.email, contact: shop.contact };
      if (shop.contact != req.user.data.contact) {
        try {
          await sendOtpToMobile(shop.contact);
          await sendShopAddedEmail(here);
        } catch (err) {
          temp1 = 0;
          console.log(err);
        }
      }
      else {
        shop.isContactVerified = true;
        shop.save();
        await sendShopAddedEmail1(here);
      }
    } catch (err) {
      console.log(err);
    }
    if (temp1 === 0) {
      return res.status(400).json({
        success: false,
        message: "Registeration Successful!",
        error: "But Some error occurred during sending email and OTP on mobile!"
      });
    }
    else {
      if (shop.contact != req.user.data.contact)
        res.status(200).json({
          success: true,
          message:
            "Registeration Successful! Verify Mobile Number of Your Shop!"
        });
      else
        res.status(200).json({
          success: true,
          message:
            "Registeration Successful!"
        });
    }
  }
  else {
    return res.status(400).json({ message: "Pincode is incorrect!" })
  }
};

module.exports.verifyContact = async (req, res) => {
  let { contact } = req.params;
  let { otp } = req.body;
  let shop = await Shop.findOne({ contact: contact });
  if (shop) {
    if (shop.isContactVerified === true) {
      res
        .status(200)
        .json({ success: true, message: "Already Verified!" });
    } else {
      await sendOtp.verify(contact, otp, async (error, data) => {
        console.log(data);
        if (data.type == "success") {
          if (shop.otpExpiresIn >= Date.now()) {
            res
              .status(200)
              .json({
                success: true,
                message: "Contact Verified!"
              });
          }
        }
        if (data.type == "error") {
          if (shop.otpExpiresIn < Date.now())
            await sendOtpToMobile(shop);
          res.status(400).json({ message: "Invalid Request or Link Expired!" });
        }
      });
    }
  } else {
    res.status(400).json({ message: "No Shop Found" });
  }
};

module.exports.retryContactVerification = async (req, res) => {
  let { contact } = req.params;
  let shop = await Shop.findOne({ contact: contact });
  if (shop) {
    if (user.isContactVerified === true) {
      res
        .status(200)
        .json({
          success: true,
          message: "Already Verified!"
        });
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

module.exports.addProducts = async (req, res) => {
  const token = req.header("x-auth-token");
  const decodedPayload = jwt.verify(token, process.env.SECRET);
  req.user = decodedPayload;
  user = await User.findOne({ "_id": req.user.data._id });
  let whichShop = user.shop;
  let { name, category, weight, size, manufacturingDate, expirationDate, expireBefore, price, discount, manufacturer, quantity } = req.body;
  if (expirationDate) {
    if (expireBefore)
      return res.status(400).json({ message: "Can't have both expiration date and expire before!" });
  }
  if (weight) {
    if (size)
      return res.status(400).json({ message: "Can't have both expiration weight and size!" });
  }
  if (!name || !category || !price || !discount || !manufacturer || !manufacturingDate || !quantity)
    return res.status(400).json({ message: "All fields are mandatory!" });
  let product;
  if (weight) {
    if (expirationDate || expireBefore)
      product = await Product.findOne({ name, category, "details.weight": weight, expirationDate, expireBefore, manufacturer, manufacturingDate, whichShop });
    else
      product = await Product.findOne({ name, category, "details.weight": weight, expireBefore, manufacturer, manufacturingDate, whichShop });
  }
  else
    product = await Product.findOne({ name, category, "details.size": size, manufacturer, whichShop });
  if (product)
    return res.status(400).json({ message: "Product is already added!" });
  if (expirationDate || expireBefore)
    product = {
      name,
      category,
      weight,
      expirationDate,
      expireBefore,
      price,
      discount,
      manufacturer,
      manufacturingDate,
      quantity
    };
  else
    product = {
      name,
      category,
      size,
      price,
      discount,
      manufacturer,
      quantity
    };
  product = await Product.create(product);
  product.whichShop = user.shop;
  await product.save();
  return res.status(400).json({ message: "Product Added Successfully!" });
}

module.exports.viewProducts = async (req, res) => {
  const token = req.header("x-auth-token");
  const decodedPayload = jwt.verify(token, process.env.SECRET);
  req.user = decodedPayload;
  user = await User.findOne({ "_id": req.user.data._id });
  if (user.role === "customer") {
    if (user.current_session.inShop === false)
      return res.status(400).json({ message: "Please get your QRcode Scanned!" })
    shop = user.current_session.currentShop;
  }
  else
    shop = user.shop;
  product = await Product.find({ "whichShop": shop });
  return res.status(200).json({ success: true, product: product });
}

module.exports.readQrData = async (req, res) => {
  let { _id } = req.body;
  let { id } = req.params;
  user = await User.findOne({ _id });
  shop = await Shop.findOne({ "_id": id });
  if (user.role != "customer")
    return res.status(400).json({ message: "You cannot Shop!" });
  user.current_session.inShop = true;
  user.current_session.currentShop = id;
  let temp = 0;
  for (var i = 0; i < user.previousShopVisits.length; i++) {
    if (user.previousShopVisits[i] == id) {
      temp = 1;
      break;
    }
  }
  if (temp == 0)
    user.previousShopVisits.push(id);
  user.save();
  return res.status(200).json({ message: "Welcome " + user.name + "!" });
}

module.exports.addToCart = async (req, res) => {
  let { id } = req.params;
  let { quantity } = req.body;
  product = await Product.findOne({ "_id": id });
  const token = req.header("x-auth-token");
  const decodedPayload = jwt.verify(token, process.env.SECRET);
  req.user = decodedPayload;
  user = await User.findOne({ "_id": req.user.data._id });
  if (!product || !user.current_session.currentShop.equals(product.whichShop))
    return res.status(400).json({ message: "No Such Product Exists!" });
  if (!user.current_session.currentShop.equals(product.whichShop))
    return res.status(400).json({ message: "Please get your QRcode Scanned!" });
  if (user.role != "customer")
    return res.status(400).json({ message: "You cannot Shop!" });
  await user.current_session.cart.push({ product: id, quantity: quantity });
  user.save();
  res.status(200).json({ message: "Added to the Cart!" });
}

module.exports.viewCart = async (req, res) => {
  const token = req.header("x-auth-token");
  const decodedPayload = jwt.verify(token, process.env.SECRET);
  req.user = decodedPayload;
  user = await User.findOne({ "_id": req.user.data._id });
  if (user.role != "customer")
    return res.status(400).json({ message: "You don't have a cart!" })
  if (user.current_session.inShop === false)
    return res.status(400).json({ message: "Please get your QRcode Scanned to start your Shopping Experience!" })
  var arr = [];
  for (var i = 0; i < user.current_session.cart.length; i++) {
    product = user.current_session.cart[i].product;
    quantity = user.current_session.cart[i].quantity;
    product = await Product.findOne({ "_id": user.current_session.cart[i].product });
    arr.push({ product: product, quantity: quantity });
  }
  return res.status(200).json({ success: true, cart: arr });
}