/**
 * Expense Model
 *
 * This file contains the model and schema for the expense.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  credit: {
    type: Number,
    required: true,
  },
  debit: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
