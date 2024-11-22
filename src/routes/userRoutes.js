const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  sendPasswordResetOTP,
  changePassword,
} = require("../controllers/userController");
const loginRateLimiter = require("../middlewares/ratelimiter");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginRateLimiter, loginUser);
userRouter.post("/logout", logout);
userRouter.post("/resetpassword", sendPasswordResetOTP);
userRouter.post("/changepassword", changePassword);
module.exports = userRouter;
