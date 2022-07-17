const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Card",
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
