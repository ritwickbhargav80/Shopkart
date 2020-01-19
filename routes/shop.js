const express = require("express");
const router = express.Router();

let {} = require("../controllers/shop_controller");

let { adminAuth, staffAuth, customerAuth, allAuth } = require("../config/auth");

module.exports = router;
