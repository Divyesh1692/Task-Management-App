const rateLimit = require("express-rate-limit");

const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again after 5 minutes.",
});

module.exports = loginRateLimiter;
