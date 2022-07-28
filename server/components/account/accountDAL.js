/**
 * Account Data Access Layer File
 *
 * This file is responsible for all the data access operations for the accounts.
 */
const Account = require("./accountModel");
const {
  generateErrorMessageFromModelError,
} = require("../../helpers/errorHandler");

// Generate filtered account object from account model object
const generateAccountObject = (accountModelObject) => {
  return {
    id: accountModelObject._id,
    name: accountModelObject.name,
    type: accountModelObject.type,
    color: accountModelObject.color,
  };
};

const attributesToNotReturn = "-__v";

// Helper functions
const accountExists = async (id) => {
  const account = await Account.findById(id);
  return account !== null;
};

const createAccount = async (account) => {
  try {
    const newAccount = new Account(account);
    const accountObject = await newAccount.save();
    return {
      data: generateAccountObject(accountObject),
      success: true,
      message: "Account created successfully",
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: generateErrorMessageFromModelError(error),
    };
  }
};

const getAccounts = async () => {
  try {
    const accounts = await Account.find({}, attributesToNotReturn);
    const filteredAccounts = accounts.map((account) => {
      return generateAccountObject(account);
    });
    return {
      data: filteredAccounts,
      success: true,
      message: "Accounts retrieved successfully",
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: generateErrorMessageFromModelError(error),
    };
  }
};

module.exports = accountsDAL = {
  createAccount,
  getAccounts,
  accountExists,
};
