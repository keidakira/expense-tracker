/**
 * Card model
 *
 * properties:
 * - id: unique identifier
 * - name: name of the card
 * - company: company associated with the card
 * - type: type of the card (Credit, Debit, etc.)
 */
const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Card", cardSchema);
