const express = require("express");
const router = express.Router();

let { register, login, addProducts } = require("../controllers/shop_controller");

let { adminAuth, staffAuth, customerAuth, allAuth, someAuth, staffandadminAuth } = require("../config/auth");

router.post("/register", adminAuth, register);
// router.post("/login", staffandadminAuth, login);
// router.post("/add", adminAuth, addProducts);

module.exports = router;
