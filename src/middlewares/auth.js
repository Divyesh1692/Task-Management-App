const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

require("dotenv").config();

const protect = async (req, res, next) => {
  const token = req.cookies.token;
  // console.log("auth token" + token);

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded" + JSON.stringify(decoded));

    req.user = await User.findById(decoded.userId).select("-password");
    // console.log("user found" + JSON.stringify(req.user));

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;
