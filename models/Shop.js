const mongoose = require("mongoose");

const ShopSchema = mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  isContactVerified: {
    type: Boolean,
    default: false,
  },
  otpExpiresIn: {
    type: Date,
  },
  address: {
    line1: {
      type: String,
      required: true,
    },
    line2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
  },
  todaySales: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
  prevSales: {
    type: [
      {
        date: { type: String, required: true },
        totalUnits: { type: Number, required: true },
        totalSalePrice: { type: Number, required: true },
        products: {
          type: [
            {
              productName: { type: String, required: true },
              quantity: {
                type: Number,
                default: 1,
              },
              price: { type: Number, required: true },
              discount: { type: Number, required: true },
            },
          ],
          default: [],
        },
      },
    ],
  },
});

const Shops = (module.exports = mongoose.model("Shops", ShopSchema));
