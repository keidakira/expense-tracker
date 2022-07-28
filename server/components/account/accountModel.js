/**
 * Account Model
 *
 * This file contains the model and schema for the account.
 */
const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate: (name) => {
      if (name.length === 0) {
        throw new Error("name field cannot be empty");
      }
      return true;
    },
  },
  type: {
    type: String,
    required: true,
    enum: {
      values: ["Credit", "Debit"],
      message: "type must be either Credit or Debit",
    },
  },
  color: {
    type: String,
    required: true,
    validate: (color) => {
      if (color.length === 0) {
        throw new Error("color field cannot be empty");
      }

      if (!validator.isHexColor(color)) {
        throw new Error("color must be a valid hex color");
      }

      return true;
    },
  },
});

module.exports = mongoose.model("Account", accountSchema);
