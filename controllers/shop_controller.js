const jwt = require("jsonwebtoken");
const SendOtp = require("sendotp");
const axios = require("axios");
const qrcode = require("qrcode");
const cloudinary = require('cloudinary');
const imgUpload = require('../config/imgUpload');
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
  if (!shopName || !description || !line || !city || !state || !pincode)
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
    if (newShop.contact === undefined)
      newShop.contact = "+91";
    else
      newShop.contact = "+91" + newShop.contact;
    if (newShop.contact === "+91")
      newShop.contact = user[0].contact;
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
  contact = "+91" + contact;
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
  contact = "+91" + contact;
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
  user = await User.findOne({ "_id": req.user.data._id });
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
      product = await Product.findOne({ name, category, "details.weight": weight, expirationDate, expireBefore, manufacturer, manufacturingDate });
    else
      product = await Product.findOne({ name, category, "details.weight": weight, expireBefore, manufacturer, manufacturingDate });
  }
  else
    product = await Product.findOne({ name, category, "details.size": size, manufacturer });
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
  let JSONobject = JSON.stringify(product);
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
          product.qrcode.id = result.public_id;
          product.qrcode.url = result.url;
          product.save();
        } else if (error) {
          console.log("QR Code is not Uploaded!");
        }
      });
    })
    .catch(err => {
      console.error(err)
    })
  product = await Product.create(product);
  product.whichShop = process.env.SHOP_ID;
  await product.save();
  return res.status(200).json({ message: "Product Added Successfully!" });
}

module.exports.viewOneProduct = async (req, res) => {
  user = await User.findOne({ "_id": req.user.data._id });
  if (user.role === "customer") {
    if (user.current_session.inShop === false)
      return res.status(400).json({ message: "Please get your QRcode Scanned!" })
    shop = user.current_session.currentShop;
  }
  else
    shop = user.shop;
  let { id } = req.params;
  product = await Product.findOne({ _id: id });
  if (product)
    return res.status(200).json({ success: true, product: product });
  else
    return res.status(400).json({ success: false, message: "No such product found!" });
}

module.exports.viewProducts = async (req, res) => {
  user = await User.findOne({ "_id": req.user.data._id });
  if (user.role === "customer") {
    if (user.current_session.inShop === false)
      return res.status(400).json({ message: "Please get your QRcode Scanned!" });
    shop = user.current_session.currentShop;
  }
  product = await Product.find({ "whichShop": process.env.SHOP_ID });
  return res.status(200).json({ success: true, product: product });
}

module.exports.refillStock = async (req, res) => {
  let { minQuantity } = req.body;
  let arr = await Product.find({ quantity: { $lt: minQuantity } });
  return res.status(200).json({ success: true, products: arr });
}

module.exports.readQrData = async (req, res) => {
  let { _id } = req.params;
  const id = process.env.SHOP_ID;
  user = await User.findOne({ _id });
  shop = await Shop.findOne({ "_id": id });
  if (user.role != "customer")
    return res.status(400).json({ message: "You cannot Shop!" });
  if (user.current_session.inShop) {
    user.current_session.inShop = false;
    user.current_session.currentShop = undefined;
    user.current_session.cart = [];
    await user.save();
    return res.status(200).json({ message: "Thank you for shopping with us!" });
  }
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

module.exports.customerCount = async (req, res) => {
  let arr = await User.find({ "current_session.inShop": true }).countDocuments();
  let arr1 = await User.find({ "role": "customer" }).countDocuments();
  return res.status(200).json({ success: true, count: arr, totalCount: arr1 });
}

module.exports.qrStatus = async (req, res) => {
  user = await User.findOne({ "_id": req.user.data._id });
  if (user.role != "customer")
    return res.status(400).json({ message: "You cannot Shop!" });
  else {
    if (user.current_session.inShop) {
      if (user.current_session.currentShop._id.equals(process.env.SHOP_ID)) {
        return res.status(200).json({ success: true, message: "Start your Shopping experience!" });
      }
      else {
        return res.status(400).json({ success: false, message: "Please get your QRcode Scanned!" });
      }
    }
    else {
      return res.status(200).json({ success: true, message: "Thank you for shopping with us!" });
    }
  }
}

module.exports.addToCart = async (req, res) => {
  let { id } = req.params;
  let { quantity } = req.body;
  product = await Product.findOne({ "_id": id });
  user = await User.findOne({ "_id": req.user.data._id });
  let shop = await Shop.findOne({ "_id": process.env.SHOP_ID });
  let x = user.current_session.currentShop;
  if (!product || !x === product.whichShop)
    return res.status(400).json({ message: "No Such Product Exists!" });
  if (!user.current_session.currentShop === product.whichShop)
    return res.status(400).json({ message: "Please get your QRcode Scanned!" });
  if (user.role != "customer")
    return res.status(400).json({ message: "You cannot Shop!" });
  if (product.quantity < quantity)
    return res.status(400).json({ message: "Your Quantity can't be greater than original quantity!" });
  if (user.current_session.cart)
    index = user.current_session.cart.findIndex(i => i.product.equals(id));
  if (index != -1) {
    index1 = shop.todaySales.findIndex(i => i.product.equals(id));
    let diff = user.current_session.cart[index].quantity - quantity;
    totalQuantity = shop.todaySales[index1].quantity - diff;
    shop.todaySales[index1].quantity = totalQuantity;
    await shop.save();
    user.current_session.cart[index].quantity = quantity;
    await user.save();
    return res.status(200).json({ message: "Cart Updated!" });
  }
  else {
    await user.current_session.cart.push({ product: id, quantity: quantity });
    index1 = shop.todaySales.findIndex(i => i.product.equals(id));
    let totalQuantity;
    if (index1 === -1)
      totalQuantity = 0;
    else
      totalQuantity = shop.todaySales[index1].quantity;
    totalQuantity += quantity;
    if (totalQuantity != quantity)
      shop.todaySales[index1].quantity = totalQuantity;
    else
      await shop.todaySales.push({ product: id, quantity: totalQuantity });
    await shop.save();
  }
  user.save();
  res.status(200).json({ message: "Added to the Cart!" });
}

module.exports.viewCart = async (req, res) => {
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

module.exports.removeFromCart = async (req, res) => {
  let { id } = req.params;
  let { quantity } = req.body;
  product = await Product.findOne({ "_id": id });
  user = await User.findOne({ "_id": req.user.data._id });
  let shop = await Shop.findOne({ "_id": process.env.SHOP_ID });
  let index = user.current_session.cart.findIndex(i => i.product.equals(id));
  if (index === -1) {
    return res.status(400).json({ message: "No Such Product in your Cart" });
  }
  arr = [];
  arr1 = [];
  if (!quantity) {
    arr1 = shop.todaySales.filter(i => !i.product.equals(id));
    shop.todaySales = arr1;
    arr = user.current_session.cart.filter(i => !i.product.equals(id));
    user.current_session.cart = arr;
  }
  else {
    index = user.current_session.cart.findIndex(i => i.product.equals(id));
    if (index != -1) {
      let diff = user.current_session.cart[index].quantity - quantity;
      index1 = shop.todaySales.findIndex(i => i.product.equals(id));
      totalQuantity = shop.todaySales[index1].quantity - diff;
      shop.todaySales[index1].quantity = quantity;
      user.current_session.cart[index].quantity = quantity;
      await shop.save();
      await user.save();
      return res.status(200).json({ message: "Cart Updated!" });
    }
  }
  await shop.save();
  await user.save();
  return res.status(200).json({ message: "Removed from Cart!" });
}

module.exports.salesToday = async (req, res) => {
  shop = await Shop.findOne({ "_id": process.env.SHOP_ID });
  let arr = [];
  let obj = {
    products: []
  };
  let obj1 = {
    productName: undefined,
    quantity: undefined,
    price: undefined,
    discount: undefined
  };
  let x = 0, y = 0;
  for (let i = 0; i < shop.todaySales.length; i++) {
    product = await Product.findOne({ "_id": shop.todaySales[i].product });
    let obj1 = {
      productName: undefined,
      quantity: undefined,
      price: undefined,
      discount: undefined
    };
    obj1.productName = product.name;
    obj1.quantity = shop.todaySales[i].quantity;
    obj1.price = product.price;
    obj1.discount = product.discount;
    x += obj1.quantity;
    y += (obj1.price - ((obj1.discount * obj1.price) / 100)) * obj1.quantity;
    obj.products.push(obj1);
  }
  return res.status(200).json({ success: true, products: obj, totalUnits: x, totalSalePrice: "Rs. " + y });
}