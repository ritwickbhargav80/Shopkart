const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
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
  },
  qrcode: {
    id: String,
    url: String
  },
  referral_code: {
    type: String
  },
  bonus: {
    type: Number,
    default: 0
  },
  current_session: {
    inShop: {
      type: Boolean,
      default: false
    },
    currentShop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop"
    },
    cart: {
      type: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products"
        },
        quantity: {
          type: Number,
          default: 1
        }
      }],
      default: []
    }
  },
  previousOrders: {
    type: [{
      amount: {
        type: Number
      },
      dateTime: {
        type: String
      },
      products: {
        type: [{
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products"
          },
          productName: {
            type: String
          },
          quantity: {
            type: Number
          },
          price: {
            type: Number
          },
          discount: {
            type: Number
          }
        }],
        default: []
      }
    }],
    default: []
  },
  previousShopVisits: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shop" }],
    default: []
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop"
  }
});

UserSchema.methods.generateAuthToken = () => {
  const token = jwt.sign(
    {
      id: this._id,
      name: this.name,
      role: this.role,
      email: this.email
    },
    process.env.SECRET
  );
  return token;
};

const User = (module.exports = mongoose.model("User", UserSchema));
