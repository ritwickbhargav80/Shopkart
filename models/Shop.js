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
  address: {
    line1: {
      type: String,
      required: true
    },
    line2: {
      type: String,
      required: true
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
  }
});

const Shops = (module.exports = mongoose.model("Shops", ShopSchema));
