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
  expirationDate: {
    type: Date,
    required: true
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
  whichShop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop"
  }
});

const Products = (module.exports = mongoose.model("Products", ProductSchema));
