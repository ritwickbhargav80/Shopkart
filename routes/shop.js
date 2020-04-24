const express = require("express");
const router = express.Router();

let { register, verifyContact, retryContactVerification, addProducts, viewOneProduct, viewProducts, refillStock, readQrData, customerCount, qrStatus, addToPreviousOrders, addToCart, viewPreviousOrders, viewCart, removeFromCart, salesToday } = require("../controllers/shop_controller");

let { adminAuth, staffAuth, customerAuth, allAuth, someAuth, staffandadminAuth } = require("../config/auth");

router.post("/register", adminAuth, register);
router.post("/verifyMobile/:contact", verifyContact);
router.get("/retryVerification/:contact", retryContactVerification);
router.post("/add", staffandadminAuth, addProducts);
router.get("/viewone/:id", allAuth, viewOneProduct);
router.get("/viewall", allAuth, viewProducts);
router.post("/refill", adminAuth, refillStock);
router.get("/readQrCode/:_id", customerAuth, readQrData);
router.get("/count", staffandadminAuth, customerCount); //check
router.get("/qrStatus", customerAuth, qrStatus);
router.post("/previousOrders", customerAuth, addToPreviousOrders);  //amount = 232.8+51.828+1568+120
router.get("/previousOrders", customerAuth, viewPreviousOrders);
// router.post("/cart/:id", customerAuth, addToCart);
// router.get("/viewcart", customerAuth, viewCart);
// router.post("/cart/remove/:id", customerAuth, removeFromCart);
router.get("/salesToday", adminAuth, salesToday); //check
//delete put
//razorpay

module.exports = router;
