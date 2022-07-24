/**
 * User model
 *
 * properties:
 * - id: unique identifier
 * - name: name of the user
 * - email: email of the user
 * - accounts: array of cards with balance associated with the user
 */
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    length: 64,
  },
  accounts: [
    {
      card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card",
      },
      balance: {
        type: mongoose.Types.Decimal128,
        required: true,
      },
      initial_balance: {
        type: mongoose.Types.Decimal128,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
