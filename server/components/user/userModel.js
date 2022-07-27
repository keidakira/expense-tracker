/**
 * User Model
 *
 * This file contains the model and schema for the user.
 */
const mongoose = require("mongoose");
const validator = require("validator");
const { hashPassword } = require("../../utils/encryption");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    validate: (name) => {
      if (name.length === 0) {
        throw new Error("name field cannot be empty");
      }
      return true;
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: (email) => {
      if (!validator.isEmail(email)) {
        throw new Error("email is invalid");
      }
      if (email.length === 0) {
        throw new Error("email field cannot be empty");
      }
      return true;
    },
  },
  password: {
    type: String,
    required: true,
    validate: (password) => {
      if (password.length === 0) {
        throw new Error("password field cannot be empty");
      }
      return true;
    },
  },
  accounts: {
    type: [
      {
        accountId: {
          type: Schema.Types.ObjectId,
          ref: "Account",
          required: true,
        },
        initialBalance: { type: Number, required: true },
        currentBalance: { type: Number, required: true },
        dateOfInitialBalance: { type: Date, required: true },
      },
    ],
    default: [],
  },
});

// Create custom method to encrypt before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await hashPassword(user.password);
  }
  next();
});

// Verify user password
userSchema.methods.verifyPassword = function (password) {
  return this.password === hashPassword(password);
};

module.exports = mongoose.model("User", userSchema);
