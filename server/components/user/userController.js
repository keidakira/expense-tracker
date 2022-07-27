/**
 * User Controller
 *
 * This file is responsible for handling all actions related to the users,
 * and sending any data related operations to userDAL.js.
 */
const { apiResponse, HTTP_STATUS } = require("../../helpers/apiResponse");
const { hashPassword } = require("../../utils/encryption");
const userDAL = require("./userDAL");

const expenseDAL = require("../expense/expenseDAL");

// Helper functions
const userExists = async (req, res, next) => {
  const id = req.params.id || req.body.id;
  const doesExist = await userDAL.userExists(id);

  if (!doesExist) {
    return apiResponse.error(res, HTTP_STATUS.BAD_REQUEST, "User not found");
  }

  next();
};

const userEmailExists = async (req, res, next) => {
  const doesExist = await userDAL.userEmailExists(req.body.email);
  if (doesExist) {
    return apiResponse.error(
      res,
      HTTP_STATUS.BAD_REQUEST,
      "User already exists"
    );
  }
  next();
};

// CRUD operations
const createUser = async (req, res, next) => {
  const { success, data, message } = await userDAL.createUser(req.body);
  if (success) {
    apiResponse.success(res, HTTP_STATUS.CREATED, data, message);
  } else {
    apiResponse.error(res, HTTP_STATUS.BAD_REQUEST, message);
  }
};

const getUser = async (req, res, next) => {
  const doesUserExist = await userDAL.userExists(req.params.id);
  if (!doesUserExist) {
    return apiResponse.error(
      res,
      HTTP_STATUS.BAD_REQUEST,
      "User does not exist"
    );
  }

  const { success, data, message } = await userDAL.getUser(req.params.id);

  if (success) {
    apiResponse.success(res, HTTP_STATUS.OK, data, message);
  } else {
    apiResponse.error(res, HTTP_STATUS.BAD_REQUEST, message);
  }
};

// Account operations
const addAccount = async (req, res, next) => {
  const id = req.params.id || req.body.id;
  const { success, data, message } = await userDAL.addAccount(id, req.body);

  if (success) {
    apiResponse.success(res, HTTP_STATUS.CREATED, data, message);
  } else {
    apiResponse.error(res, HTTP_STATUS.BAD_REQUEST, message);
  }
};

const userHasAccount = async (req, res, next) => {
  const userId = req.params.id;
  const accountId = req.body.accountId;

  const { data, success, message } = await userDAL.getUser(userId);

  if (!success) {
    return apiResponse.error(res, HTTP_STATUS.BAD_REQUEST, message);
  }

  const user = data;
  let accountExists = false;

  user.accounts.forEach((account) => {
    if (accountId.toString() === accountId) {
      accountExists = true;
    }
  });

  if (!accountExists) {
    return apiResponse.error(
      res,
      HTTP_STATUS.BAD_REQUEST,
      "User does not have account"
    );
  }

  req.body.userId = userId;
  next();
};

/**
 * Expense related controller functions
 */
const getExpenses = async (req, res, next) => {
  let success, data, message;
  if (!req.query.year) {
    const response = await expenseDAL.getAllExpensesByUserId(req.params.id);
    success = response.success;
    data = response.data;
    message = response.message;
  } else {
    const response = await expenseDAL.getFilteredExpensesByUserId(
      req.params.id,
      req.query.year,
      req.query.month
    );
    success = response.success;
    data = response.data;
    message = response.message;
  }
  if (success) {
    apiResponse.success(res, HTTP_STATUS.OK, data, message);
  } else {
    apiResponse.error(res, HTTP_STATUS.BAD_REQUEST, message);
  }
};

module.exports = userController = {
  createUser,
  userEmailExists,
  userExists,
  getUser,
  addAccount,
  userHasAccount,
  getExpenses,
};
