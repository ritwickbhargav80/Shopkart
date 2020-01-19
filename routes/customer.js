const express = require("express");
const router = express.Router();

let {} = require("../controllers/user_controller");

let { adminAuth, staffAuth, customerAuth, allAuth } = require("../config/auth");

module.exports = router;
