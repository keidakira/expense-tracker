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

// Data abstraction functions
const generateUserObjectFromModelObject = (userModelObject) => {
  return {
    id: userModelObject._id,
    name: userModelObject.name,
    email: userModelObject.email,
    accounts: userModelObject.accounts,
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
    const user = await User.findById(id, fieldsToOmit);
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
