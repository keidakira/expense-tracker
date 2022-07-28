/**
 * Expense Router
 *
 * This file contains the router for the expense.
 */
const express = require("express");
const router = express.Router();
const authController = require("./authController");
const authValidation = require("./authValidation");

router.route("/login").post(authValidation.loginUser, authController.loginUser);

module.exports = router;
