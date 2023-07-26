const User = require("../model/User");
const bcrypt = require("bcrypt");

const verifyOtp = async (req, res) => {
  const { otp, otpExpire } = req.body;
  if (!otp) return res.status(400).json({ message: "otp required" });
  const numberTypeOTP = Number(otp);

  const findUser = await User.findOne({ otp: numberTypeOTP }).exec();
  if (!findUser)
    return res.status(401).json({ message: "your otp did not match" });

  const now = Date.now();
  const usersOTPTime = findUser.otpExpire;

  if (Number(usersOTPTime) < otpExpire) {
    return res.status(401).json({ message: "Your otp code expired" });
  }

  res.json({ message: "OTP verified successfully" });
};

module.exports = { verifyOtp };
