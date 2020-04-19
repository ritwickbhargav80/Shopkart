const mongoose = require("mongoose");

const ShopSchema = mongoose.Schema({
  shopName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  isContactVerified: {
    type: Boolean,
    default: false
  },
  otpExpiresIn: {
    type: Date
  },
  address: {
    line1: {
      type: String,
      required: true
    },
    line2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  todaySales: {
    type: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }],
    default: []
  }
});

const Shops = (module.exports = mongoose.model("Shops", ShopSchema));
