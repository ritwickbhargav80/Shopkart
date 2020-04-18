const express = require("express");
const router = express.Router();

let { register, verifyContact, retryContactVerification, addProducts, viewOneProduct, updateOneProduct, viewProducts, readQrData, addToCart, viewCart, removeFromCart } = require("../controllers/shop_controller");

let { adminAuth, staffAuth, customerAuth, allAuth, someAuth, staffandadminAuth } = require("../config/auth");

router.post("/register", adminAuth, register);
router.post("/verifyMobile/:contact", verifyContact);
router.get("/retryVerification/:contact", retryContactVerification);
router.post("/add", staffandadminAuth, addProducts);
router.get("/viewone/:id", allAuth, viewOneProduct);
router.post("/updateone/:id", staffandadminAuth, updateOneProduct);
router.get("/viewall", allAuth, viewProducts);
router.post("/readQrCode/:id", readQrData);
router.post("/cart/:id", customerAuth, addToCart);
router.get("/viewcart", customerAuth, viewCart);
router.post("/cart/remove/:id", customerAuth, removeFromCart);
//delete put
//razorpay

module.exports = router;
