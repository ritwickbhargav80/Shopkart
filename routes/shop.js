const express = require("express");
const router = express.Router();

let { register, verifyContact, retryContactVerification, addProducts, viewProducts, readQrData, addToCart } = require("../controllers/shop_controller");

let { adminAuth, staffAuth, customerAuth, allAuth, someAuth, staffandadminAuth } = require("../config/auth");

router.post("/register", adminAuth, register);
router.post("/verifyMobile/:contact", verifyContact);
router.get("/retryVerification/:contact", retryContactVerification);
router.post("/add", staffandadminAuth, addProducts);
router.get("/viewall", allAuth, viewProducts);
router.post("/readQrCode/:id", readQrData);
router.post("/cart/:id", customerAuth, addToCart);

module.exports = router;
