const express = require("express");
const router = express.Router();

let { register, login, verifyEmail } = require("../controllers/user_controller");

let { adminAuth, staffAuth, customerAuth, allAuth } = require("../config/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/verifyEmail/:email/:token", verifyEmail);

module.exports = router;