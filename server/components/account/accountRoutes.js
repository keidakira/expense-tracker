/**
 * Accounts Route
 *
 * All routes related to /accounts will be handled in this file
 */
const express = require("express");
const router = express.Router();
const accountController = require("./accountController");
const accountValidation = require("./accountValidation");

router
  .route("/")
  .post(accountValidation.createAccount, accountController.createAccount)
  .get(accountController.getAccounts);

module.exports = router;
