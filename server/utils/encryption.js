/**
 * File contains all kinds of encryption and decryption algorithms
 */
const crypto = require("crypto");
const SALT = process.env.SALT;

const sha256 = (string, salt = false) => {
  return crypto
    .createHash("sha256")
    .update(string + (salt ? SALT : ""))
    .digest("hex");
};

const md5 = (string, salt = false) => {
  return crypto
    .createHash("md5")
    .update(string + (salt ? SALT : ""))
    .digest("hex");
};

module.exports = {
  sha256,
  md5,
};
