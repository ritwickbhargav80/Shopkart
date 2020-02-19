var mongoose = require("mongoose");

var ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  details: {
    weight: {
      type: String
    },
    size: {
      type: String
    }
  },
  manufacturingDate: {
    type: Date
  },
  expirationDate: {
    type: Date
  },
  expireBefore: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  manufacturer: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  whichShop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop"
  }
});

const Products = (module.exports = mongoose.model("Products", ProductSchema));
