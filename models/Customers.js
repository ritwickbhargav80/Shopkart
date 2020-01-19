const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");

const CustomerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    index: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetPwd: {
    token: {
      type: String
    },
    expiresIn: {
      type: Date
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  verifyEmail: {
    token: {
      type: String
    },
    expiresIn: {
      type: Date
    }
  },
  contact: {
    type: String,
    required: true
  },
  isContactVerified: {
    type: Boolean,
    default: false
  },
  otpExpiresIn: {
    type: Date
  },
  role: {
    type: String,
    required: true
  }
});

CustomerSchema.plugin(uniqueValidator);

CustomerSchema.methods.generateAuthToken = () => {
  const token = jwt.sign(
    {
      id: this._id,
      name: this.name,
      role: this.role,
      email: this.email
    },
    process.env.secret
  );
  return token;
};

const User = (module.exports = mongoose.model("Customer", CustomerSchema));
