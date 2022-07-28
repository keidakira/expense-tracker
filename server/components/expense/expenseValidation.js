/**
 * Expense Validation File
 *
 * This file contains all the necessary validations for actions of the expense.
 */
const Joi = require("joi");
const { HTTP_STATUS, apiResponse } = require("../../helpers/apiResponse");
const {
  generateErrorMessageFromJoiError,
} = require("../../helpers/errorHandler");

const createExpense = (req, res, next) => {
  const schema = Joi.object({
    date: Joi.date().required().less("now").messages({
      "any.required": "date is a required field",
      "date.base": "date is invalid",
      "date.less": "date cannot be in the future",
    }),
    accountId: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        "any.required": "accountId is a required field",
        "string.empty": "accountId cannot be empty",
        "string.pattern.base": "accountId is not a valid account id",
      }),
    credit: Joi.number().positive().required().messages({
      "any.required": "credit is a required field",
      "number.empty": "credit cannot be empty",
      "number.positive": "credit must be positive",
    }),
    debit: Joi.number().positive().required().messages({
      "any.required": "debit is a required field",
      "number.empty": "debit cannot be empty",
      "number.positive": "debit must be positive",
    }),
    category: Joi.string().required().messages({
      "any.required": "category is a required field",
      "string.empty": "category cannot be empty",
    }),
    notes: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return apiResponse.error(
      res,
      HTTP_STATUS.BAD_REQUEST,
      generateErrorMessageFromJoiError(error)
    );
  }

  next();
};

module.exports = expenseValidation = {
  createExpense,
};
