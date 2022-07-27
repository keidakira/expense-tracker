/**
 * Account Validation File
 *
 * This file contains all the validation functions for the account routes
 */
const Joi = require("joi");
const { HTTP_STATUS, apiResponse } = require("../../helpers/apiResponse");
const {
  generateErrorMessageFromJoiError,
} = require("../../helpers/errorHandler");

const createAccount = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().trim().messages({
      "any.required": "name is a required field",
      "string.empty": "name cannot be empty",
    }),
    type: Joi.string().required().valid("Credit", "Debit").messages({
      "any.required": "type is a required field",
      "string.empty": "type cannot be empty",
      "any.only": "type must be either Credit or Debit",
    }),
    color: Joi.string()
      .required()
      .trim()
      .pattern(/^#[A-Fa-f0-9]{6}/)
      .messages({
        "any.required": "color is a required field",
        "string.empty": "color cannot be empty",
        "string.pattern.base": "color must be a valid hex color",
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

module.exports = accountValidation = {
  createAccount,
};
