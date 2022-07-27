/**
 * Api Response Structure
 *
 * This file contains the structure of the api response for all the api calls.
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const apiResponse = {
  success: (response, httpCode, data, message) => {
    return response.status(httpCode).json({
      error: false,
      data,
      message,
    });
  },
  error: (response, httpCode, errorMessage) => {
    return response.status(httpCode).json({
      error: true,
      message: errorMessage,
    });
  },
};

module.exports = {
  HTTP_STATUS,
  apiResponse,
};
