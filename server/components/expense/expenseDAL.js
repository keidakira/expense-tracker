/**
 * Expense Data Access Layer
 *
 * This file is responsible for interacting with the Expense model,
 * and performing various actions or tasks related to data.
 */
const Expense = require("./expenseModel");
const {
  generateErrorMessageFromModelError,
} = require("../../helpers/errorHandler");
const { getStartAndEndDatesOfYearAndMonth } = require("../../utils/date");

// Data abstraction functions
const generateExpenseObjectFromModelObject = (expenseModelObject) => {
  return {
    id: expenseModelObject._id,
    userId: expenseModelObject.userId,
    accountId: expenseModelObject.accountId,
    credit: expenseModelObject.credit,
    debit: expenseModelObject.debit,
    category: expenseModelObject.category,
    notes: expenseModelObject.notes,
    date: expenseModelObject.date,
  };
};

const fieldsToOmit = "-__v";

// Helper functions

// CRUD operations
const getAllExpenses = async () => {
  try {
    const expenses = await Expense.find({}, fieldsToOmit);
    return {
      success: true,
      data: generateExpenseObjectFromModelObject(expenses),
      message: "Expenses retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: generateErrorMessageFromModelError(error),
    };
  }
};

const getAllExpensesByUserId = async (userId) => {
  try {
    const expenses = await Expense.find({ userId }, fieldsToOmit);
    return {
      success: true,
      data: expenses,
      message: "Expenses retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: generateErrorMessageFromModelError(error),
    };
  }
};

const getFilteredExpensesByUserId = async (userId, year, month) => {
  const { startDate, endDate } = getStartAndEndDatesOfYearAndMonth(year, month);

  try {
    const expenses = await Expense.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    return {
      success: true,
      data: expenses,
      message: "Expenses retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: generateErrorMessageFromModelError(error),
    };
  }
};

const createExpense = async (expenseObject) => {
  try {
    const expense = new Expense(expenseObject);
    const expenseModelObject = await expense.save();
    return {
      data: generateExpenseObjectFromModelObject(expenseModelObject),
      success: true,
      message: "Expense created successfully",
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: generateErrorMessageFromModelError(error),
    };
  }
};

module.exports = expenseDAL = {
  getAllExpenses,
  getAllExpensesByUserId,
  getFilteredExpensesByUserId,
  createExpense,
};
