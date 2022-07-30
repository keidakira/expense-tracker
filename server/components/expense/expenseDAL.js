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
  const account = {
    id: expenseModelObject.accountId._id,
    name: expenseModelObject.accountId.name,
    color: expenseModelObject.accountId.color,
  };

  return {
    id: expenseModelObject._id,
    userId: expenseModelObject.userId,
    account,
    credit: expenseModelObject.credit,
    debit: expenseModelObject.debit,
    category: expenseModelObject.category,
    notes: expenseModelObject.notes,
    date: expenseModelObject.date,
  };
};

const convertModelObjectsToObjects = (modelObjects) => {
  return modelObjects.map((modelObject) => {
    return generateExpenseObjectFromModelObject(modelObject);
  });
};

const fieldsToOmit = "-__v";

// Helper functions

// CRUD operations
const getAllExpenses = async () => {
  try {
    const expenses = await Expense.find({}, fieldsToOmit).populate("accountId");
    return {
      success: true,
      data: convertModelObjectsToObjects(expenses),
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
    const expenses = await Expense.find({ userId }, fieldsToOmit).populate(
      "accountId"
    );
    return {
      success: true,
      data: convertModelObjectsToObjects(expenses),
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
    }).populate("accountId");

    return {
      success: true,
      data: convertModelObjectsToObjects(expenses),
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
