/**
 * Error Handler File
 *
 * This file handles all sorts of errors that may occur in the application.
 */
const generateErrorMessageFromModelError = ({ errors }) => {
  console.log("Errors are: ", errors);
  let errorMessages = [];
  for ([key, value] of Object.entries(errors)) {
    errorMessages.push({ name: key, message: value.message });
  }

  return errorMessages;
};

const generateErrorMessageFromJoiError = ({ details }) => {
  console.log("Error details are: ", details);
  let errorMessages = [];
  // TODO: sometimes single name has multiple messages, allow only one
  for (let i = 0; i < details.length; i++) {
    errorMessages.push({
      name: details[i].context.key,
      message: details[i].message,
    });
  }

  return errorMessages;
};

module.exports = {
  generateErrorMessageFromModelError,
  generateErrorMessageFromJoiError,
};
