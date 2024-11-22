const jwt = require("jsonwebtoken");

require("dotenv").config();
const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("token", token, { expires: new Date(Date.now() + 86400000) }); // 1 day cookie expiration
  console.log("cookie stored successfully");

  return token;
};

module.exports = { generateTokenAndSetCookie };
