/**
 * This file is used for all JWT related functions
 */
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const generateToken = (data) => {
  return jwt.sign(data, secret, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
