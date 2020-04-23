const express = require("express");
const router = express.Router();

let { register, addStaff, login, verifyEmail, verifyContact, retryContactVerification, profile, sendForgetEmail, forgetPassword, deleteUser } = require("../controllers/user_controller");

let { adminAuth, allAuth, someAuth } = require("../config/auth");

router.post("/register", register);
router.post("/addStaff", adminAuth, addStaff);
router.post("/login", login);
router.get("/verifyEmail/:email/:token", verifyEmail); // token to generate 
router.post("/verifyMobile/:contact", verifyContact);
router.get("/retryVerification/:contact", retryContactVerification);
router.get("/profile", allAuth, profile);
router.get("/forgetpassword/:emailormobile", sendForgetEmail); // auto-generated
router.post("/forgetpassword/:emailormobile", forgetPassword); // /forgetpassword/:emailormobile
router.get("/delete/:id", someAuth, deleteUser);

module.exports = router;