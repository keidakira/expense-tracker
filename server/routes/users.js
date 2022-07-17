/**
 * /api/users Route
 *
 * @description This route is used for any users related APIs in the database.
 * @author Srinandan Komanduri
 */
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { sha256, md5 } = require("../utils/encryption");

/**
 * @route   GET api/users
 * @desc    Get all users
 * @access  Admin
 * @body    {password: string}
 *
 * @returns [Users]
 */
router.get("/", (req, res) => {
  const { password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      error: true,
      message: "Invalid authentication",
    });
  }

  User.find()
    .populate("accounts.card")
    .then((users) => res.json(users))
    .catch((err) =>
      res.status(404).json({ error: true, message: "No users found" })
    );
});

/**
 * @route   POST api/users
 * @desc    Create a user
 * @access  Admin
 * @body    User, {password: string}
 *
 * @returns User
 */
router.post("/", (req, res) => {
  const { token } = req.body;
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      error: true,
      message: "Invalid authentication",
    });
  }

  const { password } = req.body;
  const salt = process.env.SALT;
  let encryptedPassword = sha256(md5(password, true));

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: encryptedPassword,
    accounts: req.body.accounts,
  });
  newUser
    .save()
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json({ error: "Error: " + err }));
});

/**
 * @route   GET api/users/:id
 * @desc    Get a user by id
 * @access  Admin
 * @body    {password: string}, {id: string}
 *
 * @returns User
 */
router.get("/:id", (req, res) => {
  const password = "poop";
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      error: true,
      message: "Invalid authentication",
    });
  }

  User.findById(req.params.id)
    .populate("accounts.card")
    .then((user) => res.json(user))
    .catch((err) =>
      res.status(404).json({ error: true, message: "No user found" })
    );
});

/**
 * @route   PUT api/users/:id/add-account
 * @desc    Add an account to a user
 * @access  Admin
 * @body    User, {password: string}, {card: string}, {balance: number}
 *
 * @returns User
 */
router.put("/:id/add-account", (req, res) => {
  const { password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      error: true,
      message: "Invalid authentication",
    });
  }
  User.findById(req.params.id)
    .then((user) => {
      user.accounts.push({
        card: req.body.account.card,
        balance: req.body.account.balance,
        initial_balance: req.body.account.balance,
      });
      user.save().then((user) => res.json(user));
    })
    .catch((err) => res.status(400).json({ error: "Error: " + err }));
});

module.exports = router;
