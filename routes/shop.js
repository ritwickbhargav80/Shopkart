const express = require("express");
const router = express.Router();

let { register, verifyContact, retryContactVerification, addProducts, viewOneProduct, viewProducts, readQrData, qrStatus, addToCart, viewCart, removeFromCart } = require("../controllers/shop_controller");

let { adminAuth, staffAuth, customerAuth, allAuth, someAuth, staffandadminAuth } = require("../config/auth");

router.post("/register", adminAuth, register);
router.post("/verifyMobile/:contact", verifyContact);
router.get("/retryVerification/:contact", retryContactVerification);
router.post("/add", staffandadminAuth, addProducts);
router.get("/viewone/:id", allAuth, viewOneProduct);
router.get("/viewall", allAuth, viewProducts);
router.get("/readQrCode/:_id", readQrData);
router.get("/qrStatus", customerAuth, qrStatus);
router.post("/cart/:id", customerAuth, addToCart);
router.get("/viewcart", customerAuth, viewCart);
router.post("/cart/remove/:id", customerAuth, removeFromCart);
//delete put
//razorpay

module.exports = router;
