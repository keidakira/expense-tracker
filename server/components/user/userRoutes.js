/**
 * User Route
 *
 * All routes related to /users will be handled in this file
 */
const express = require("express");
const router = express.Router();
const userController = require("./userController");
const userValidation = require("./userValidation");

const accountController = require("../account/accountController");

const expenseValidation = require("../expense/expenseValidation");
const expenseController = require("../expense/expenseController");

router
  .route("/")
  .post(
    userValidation.createUser,
    userController.userEmailExists,
    userController.createUser
  );

router.route("/:id").get(userValidation.getUser, userController.getUser);

router
  .route("/:id/accounts")
  .post(
    userValidation.addAccount,
    userController.userExists,
    accountController.accountExists,
    userController.addAccount
  );

router
  .route("/:id/expenses")
  .post(
    expenseValidation.createExpense,
    userValidation.createExpense,
    userController.userExists,
    userController.userHasAccount,
    expenseController.createExpense
  )
  .get(
    userValidation.getExpenses,
    userController.userExists,
    userController.getExpenses
  );

module.exports = router;
