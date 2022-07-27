/**
 * Account Controller File
 *
 * This file is responsible for handling all actions related to the accounts,
 * and sending any data related operations to accountDAL.js.
 */
const accountDAL = require("./accountDAL");
const { HTTP_STATUS, apiResponse } = require("../../helpers/apiResponse");

// Helper functions
const accountExists = async (req, res, next) => {
  const accountId = req.params.accountId ?? req.body.accountId;
  const account = await accountDAL.accountExists(accountId);

  if (!account) {
    return apiResponse.error(res, HTTP_STATUS.BAD_REQUEST, "Account not found");
  }

  next();
};

const createAccount = async (req, res, next) => {
  const { success, data, message } = await accountDAL.createAccount(req.body);
  if (success) {
    apiResponse.success(res, HTTP_STATUS.CREATED, data, message);
  } else {
    apiResponse.error(res, HTTP_STATUS.BAD_REQUEST, message);
  }
};

const getAccounts = async (req, res, next) => {
  const { success, data, message } = await accountDAL.getAccounts();
  if (success) {
    apiResponse.success(res, HTTP_STATUS.OK, data, message);
  } else {
    apiResponse.error(res, HTTP_STATUS.BAD_REQUEST, message);
  }
};

module.exports = accountController = {
  createAccount,
  getAccounts,
  accountExists,
};
