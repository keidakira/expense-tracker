/**
 * /api/auth Route
 *
 * @description This route is used for all authentication API calls
 * @author Srinandan Komanduri
 */
const express = require("express");
const User = require("../models/User");
const { sha256, md5 } = require("../utils/encryption");
const { generateToken } = require("../utils/jwt");
const router = express.Router();

/**
 * @route  POST api/auth/login
 * @desc   Login user and return a token and data
 * @access Public
 *
 * @body   {email: string, password: string}
 * @returns {token: string, userId: string, email: string}
 */
router.post("/login", (req, res) => {
  (async () => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "Please enter all fields" });
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ error: true, message: "User does not exist" });
    }

    // Check if password is correct
    const encryptedPassword = sha256(md5(password, true));
    if (encryptedPassword !== user.password) {
      return res
        .status(400)
        .json({ error: true, message: "Password is incorrect" });
    }

    // Create a token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Return token and user data
    return res.json({
      error: false,
      data: {
        token,
        userId: user.id,
        email: user.email,
      },
    });
  })();
});

module.exports = router;
