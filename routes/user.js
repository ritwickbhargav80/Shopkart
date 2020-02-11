const express = require("express");
const router = express.Router();

let { register, addStaff, login, verifyEmail, verifyContact, retryContactVerification, profile, sendForgetEmail, forgetPassword, deleteUser } = require("../controllers/user_controller");

let { adminAuth, allAuth, someAuth } = require("../config/auth");

router.post("/register", register);
router.post("/addStaff", adminAuth, addStaff);
router.post("/login", login);
router.get("/verifyEmail/:email/:token", verifyEmail);
router.post("/verifyMobile/:contact", verifyContact);
router.get("/retryVerification/:contact", retryContactVerification);
router.get("/profile", allAuth, profile);
router.get("/forgetpassword/:emailormobile", sendForgetEmail);
router.post("/forgetpassword/:email/:token", forgetPassword);
router.get("/delete/:id/:email", someAuth, deleteUser);

module.exports = router;