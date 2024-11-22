const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../models/userSchema");
const { generateTokenAndSetCookie } = require("../utils/generateToken");
const { token } = require("morgan");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Are Required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Password Must Be At Least 6 Characters",
      });
    }

    const existingUserByEmail = await User.findOne({ email: email });

    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already Exists" });
    }

    const existingUserByUsername = await User.findOne({ username: username });

    if (existingUserByUsername) {
      return res
        .status(400)
        .json({ success: false, message: "Username Already Exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
    });

    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered",
    });
  } catch (error) {
    console.log("Error in Signup", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Are Required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      success: true,
      message: "Login Succesfull",
    });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt-token");
    res.status(200).json({ success: true, message: "Logged Out Successfully" });
  } catch (error) {
    console.log("error in logout", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const sendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.otpExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const message = `Your password reset OTP is: ${otp}\n\nIt is valid for 15 minutes.`;
    await sendEmail(user.email, "Password Reset OTP", message);

    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.resetOTP !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user.password = hashedPassword;
    user.resetOTP = null;
    user.otpExpires = null;

    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logout,
  changePassword,
  sendPasswordResetOTP,
};
