const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

module.exports.adminAuth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "Access denied!" });
  } else {
    const decodedPayload = jwt.verify(token, process.env.SECRET);
    req.user = decodedPayload;
    if (req.user.data.role === "admin") {
      return next();
    } else {
      return res.status(401).json({ message: "Access denied!" });
    }
  }
};

module.exports.staffAuth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "Access denied!" });
  } else {
    const decodedPayload = jwt.verify(token, process.env.SECRET);
    req.user = decodedPayload;
    if (req.user.data.role === "staff") {
      return next();
    } else {
      return res.status(401).json({ message: "Access denied!" });
    }
  }
};

module.exports.customerAuth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "Access denied!" });
  } else {
    const decodedPayload = jwt.verify(token, process.env.SECRET);
    req.user = decodedPayload;
    if (req.user.data.role === "customer") {
      return next();
    } else {
      return res.status(401).json({ message: "Access denied!" });
    }
  }
};

module.exports.allAuth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ message: "Access denied!" });
  } else {
    const decodedPayload = jwt.verify(token, process.env.SECRET);
    req.user = decodedPayload;
    return next();
  }
};
