/**
 * User Data Access Layer
 *
 * This file is responsible for interacting with the User model,
 * and performing various actions or tasks related to data.
 */
const User = require("./userModel");
const {
  generateErrorMessageFromModelError,
} = require("../../helpers/errorHandler");
const {
  getNewDate,
  getTomorrowDate,
  isDate1BeforeDate2,
} = require("../../utils/date");

// Data abstraction functions
const generateUserObjectFromModelObject = (userModelObject) => {
  const accounts = userModelObject.accounts.map((account) => {
    return {
      accountId: account.accountId._id,
      accountName: account.accountId.name,
      initialBalance: account.initialBalance,
      currentBalance: account.currentBalance,
      dateOfInitialBalance: account.dateOfInitialBalance,
    };
  });

  return {
    id: userModelObject._id,
    name: userModelObject.name,
    email: userModelObject.email,
    accounts,
  };
};

const fieldsToOmit = "-__v -password";

// Helper functions
const userEmailExists = async (email) => {
  const user = await User.findOne({ email });
  return user !== null;
};

const userExists = async (id) => {
  const user = await User.findById(id);
  return user !== null;
};

const verifyPasswordWithEmail = async (email, password) => {
  const user = await User.findOne({ email });
  return user.verifyPassword(password);
};

// CRUD operations
const createUser = async (user) => {
  try {
    const newUser = new User(user);
    const userObject = await newUser.save();
    return {
      data: generateUserObjectFromModelObject(userObject),
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: generateErrorMessageFromModelError(error),
    };
  }
};

const getUser = async (id) => {
  try {
    const user = await User.findById(id, fieldsToOmit).populate(
      "accounts.accountId"
    );
    return {
      data: generateUserObjectFromModelObject(user),
      success: true,
      message: "User retrieved successfully",
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: generateErrorMessageFromModelError(error),
    };
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email }, fieldsToOmit);

    if (user) {
      return {
        data: generateUserObjectFromModelObject(user),
        success: true,
        message: "User retrieved successfully",
      };
    } else {
      return {
        data: null,
        success: false,
        message: "User does not exist",
      };
    }
  } catch (error) {
    return {
      data: null,
      success: false,
      message: generateErrorMessageFromModelError(error),
    };
  }
};

// Account operations
const addAccount = async (id, account) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return {
        data: null,
        success: false,
        message: "User does not exist",
      };
    }

    const balanceDate = account.dateOfInitialBalance;
    const currentDate = getTomorrowDate();

    if (!isDate1BeforeDate2(balanceDate, currentDate)) {
      return {
        data: null,
        success: false,
        message: [
          {
            name: "dateOfInitialBalance",
            message: "dateOfInitialBalance cannot be in the future",
          },
        ],
      };
    }

    let doesUserAlreadyHaveAccount = false;
    user.accounts.forEach((userAccount) => {
      if (userAccount.accountId.toString() === account.accountId) {
        doesUserAlreadyHaveAccount = true;
      }
    });

    if (doesUserAlreadyHaveAccount) {
      return {
        data: null,
        success: false,
        message: "User already has an account with this accountId",
      };
    }

    account.currentBalance = account.initialBalance;

    user.accounts.push(account);
    await user.save();

    return {
      data: generateUserObjectFromModelObject(user),
      success: true,
      message: "Account added successfully",
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: generateErrorMessageFromModelError(error),
    };
  }
};

module.exports = userDAL = {
  createUser,
  userEmailExists,
  userExists,
  getUser,
  getUserByEmail,
  verifyPasswordWithEmail,
  addAccount,
};
