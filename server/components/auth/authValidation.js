/**
 * Auth Validation File
 *
 * This file contains all the necessary validations for actions of the authentication.
 */
const Joi = require("joi");
const { HTTP_STATUS, apiResponse } = require("../../helpers/apiResponse");
const {
  generateErrorMessageFromJoiError,
} = require("../../helpers/errorHandler");

const loginUser = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "any.required": "email is a required field",
      "string.empty": "email cannot be empty",
      "string.email": "email is invalid",
    }),
    password: Joi.string().required().messages({
      "any.required": "password is required",
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

module.exports = authValidation = {
  loginUser,
};
