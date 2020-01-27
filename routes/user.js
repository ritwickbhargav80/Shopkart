const express = require("express");
const router = express.Router();

let { register, login, verifyEmail, verifyContact, retryContactVerification, profile, sendForgetEmail, forgetPassword } = require("../controllers/user_controller");

let { allAuth, someAuth } = require("../config/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/verifyEmail/:email/:token", verifyEmail);
router.post("/verifyMobile/:contact", verifyContact);
router.get("/retryVerification/:contact", retryContactVerification);
router.get("/profile", allAuth, profile);
router.get("/forgetpassword/:emailormobile", sendForgetEmail);
router.post("/forgetpassword/:email/:token", forgetPassword);
router.get("/delete/:id/:email", someAuth, deleteUser);
router.post("/contact", contactAdmin);

module.exports = router;