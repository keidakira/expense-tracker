/**
 * User Validation File
 *
 * This file contains all the necessary validations for actions of the user.
 */
const Joi = require("joi");
const { HTTP_STATUS, apiResponse } = require("../../helpers/apiResponse");
const {
  generateErrorMessageFromJoiError,
} = require("../../helpers/errorHandler");

const createUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().messages({
      "any.required": "name is a required field",
      "string.empty": "name cannot be empty",
    }),
    email: Joi.string().required().trim().email().messages({
      "any.required": "email is a required field",
      "string.empty": "email cannot be empty",
      "string.email": "email is invalid",
    }),
    password: Joi.string().required().trim().messages({
      "any.required": "password is a required field",
      "string.empty": "password cannot be empty",
    }),
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

const getUser = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        "any.required": "id is a required field",
        "string.empty": "id cannot be empty",
        "string.pattern.base": "id is not a valid ObjectId",
      }),
  });

  const { error } = schema.validate(req.params, { abortEarly: false });

  if (error) {
    return apiResponse.error(
      res,
      HTTP_STATUS.BAD_REQUEST,
      generateErrorMessageFromJoiError(error)
    );
  } else {
    next();
  }
};

/**
 * Accounts related schema validations
 */

const addAccount = (req, res, next) => {
  const bodySchema = Joi.object({
    accountId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "any.required": "accountId is a required field",
        "string.empty": "accountId cannot be empty",
        "string.pattern.base": "accountId is not a valid ObjectId",
      }),
    initialBalance: Joi.number().positive().precision(2).required().messages({
      "any.required": "initialBalance is a required field",
      "number.empty": "initialBalance cannot be empty",
      "number.precision": "initialBalance must have 2 decimal places",
      "number.positive": "initialBalance must be positive",
    }),
    dateOfInitialBalance: Joi.date().required().iso().messages({
      "any.required": "dateOfInitialBalance is a required field",
      "date.iso": "dateOfInitialBalance must be in ISO format",
    }),
  });

  const paramSchema = Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "any.required": "id is a required field",
        "string.empty": "id cannot be empty",
        "string.pattern.base": "id is not a valid user id",
      }),
  });

  const { error } = bodySchema.validate(req.body, { abortEarly: false });
  const { error: paramError } = paramSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error || paramError) {
    return apiResponse.error(
      res,
      HTTP_STATUS.BAD_REQUEST,
      generateErrorMessageFromJoiError(paramError || error)
    );
  } else {
    next();
  }
};

/**
 * Expenses related schema validations
 */
const getExpenses = (req, res, next) => {
  const { year, month } = req.query;

  const paramSchema = Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "any.required": "id is a required field",
        "string.empty": "id cannot be empty",
        "string.pattern.base": "id is not a valid user id",
      }),
  });

  const querySchema = Joi.object({
    year: Joi.number()
      .integer()
      .min(2020)
      .max(new Date().getFullYear())
      .required()
      .messages({
        "any.required": "year is a required field",
        "number.empty": "year cannot be empty",
        "number.integer": "year must be an integer",
        "number.min": "year must be greater than 1900",
        "number.max": "year must be less than 2100",
      }),
    month: Joi.number().integer().min(1).max(12).required().messages({
      "any.required": "month is a required field",
      "number.empty": "month cannot be empty",
      "number.integer": "month must be an integer",
      "number.min": "month must be greater than 0",
      "number.max": "month must be less than 13",
    }),
  });

  const { error } = paramSchema.validate(req.params, { abortEarly: false });
  const { error: queryError } = querySchema.validate(req.query, {
    abortEarly: false,
  });
  const shouldCheckQueryError = (year ?? month ?? false) && queryError;

  if (error || shouldCheckQueryError) {
    return apiResponse.error(
      res,
      HTTP_STATUS.BAD_REQUEST,
      generateErrorMessageFromJoiError(error || queryError)
    );
  } else {
    next();
  }
};

const createExpense = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "any.required": "id is a required field",
        "string.empty": "id cannot be empty",
        "string.pattern.base": "id is not a valid user id",
      }),
  });

  const { error } = schema.validate(req.params, { abortEarly: false });

  if (error) {
    return apiResponse.error(
      res,
      HTTP_STATUS.BAD_REQUEST,
      generateErrorMessageFromJoiError(error)
    );
  } else {
    next();
  }
};

module.exports = userValidation = {
  createUser,
  getUser,
  addAccount,
  getExpenses,
  createExpense,
};
