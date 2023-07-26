const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      default: "Customer",
    },
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: Number,
    },
    otpExpire: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
