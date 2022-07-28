/**
 * Auth Controller File
 *
 * This file is responsible for handling all actions related to the auth,
 * and sending any data related operations to userDAL.js.
 */
const userDAL = require("../user/userDAL");
const { HTTP_STATUS, apiResponse } = require("../../helpers/apiResponse");

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const { data: user, success, message } = await userDAL.getUserByEmail(email);

  if (!success) {
    return apiResponse.error(res, HTTP_STATUS.NOT_FOUND, message);
  }

  const isPasswordCorrect = await userDAL.verifyPasswordWithEmail(
    email,
    password
  );

  if (!isPasswordCorrect) {
    return apiResponse.error(res, HTTP_STATUS.UNAUTHORIZED, "Invalid password");
  }

  return apiResponse.success(
    res,
    HTTP_STATUS.OK,
    user,
    "User logged in successfully"
  );
};

module.exports = authController = {
  loginUser,
};
