/**
 * Expense Controller File
 *
 * This file is responsible for handling all actions related to the expenses,
 * and sending any data related operations to expenseDAL.js.
 */
const expenseDAL = require("./expenseDAL");
const { apiResponse, HTTP_STATUS } = require("../../helpers/apiResponse");

// CRUD operations
const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseDAL.getAllExpenses();
    res.status(200).json(expenses);
  } catch (err) {
    next(err);
  }
};

const createExpense = async (req, res, next) => {
  const { data, success, message } = await expenseDAL.createExpense(req.body);

  if (success) {
    apiResponse.success(res, HTTP_STATUS.CREATED, data, message);
  } else {
    apiResponse.error(res, HTTP_STATUS.BAD_REQUEST, message);
  }
};

module.exports = expenseController = {
  getAllExpenses,
  createExpense,
};
