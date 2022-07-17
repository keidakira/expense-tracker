// Router for /expenses route
const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const User = require("../models/User");
const { convertToInteger, convertToDecimal } = require("../utils/mathf");

/**
 * @route   GET api/expenses
 * @desc    Get all expenses
 * @access  Admin
 *
 * @returns [Expenses]
 */
router.get("/", (req, res) => {
  Expense.find()
    .populate("card")
    .then((expenses) => res.json(expenses))
    .catch((err) =>
      res.status(404).json({ error: true, message: "No expenses found" })
    );
});

/**
 * @route   POST api/expenses
 * @desc    Create an expense
 * @access  Public
 * @body    Expense
 *
 * @returns Expense
 */
router.post("/", (req, res) => {
  (async () => {
    let balance = -1;
    let cardIndex = -1;
    let accounts = [];
    let userId = req.body.user;
    let credit = convertToDecimal(req.body.credit);
    let debit = convertToDecimal(req.body.debit);

    // Find balance of the user with the id = userId
    const user = await User.findById(userId);

    accounts = user.accounts;
    user.accounts.map(({ card, balance: curr_balance }, index) => {
      if (card._id.toString() === req.body.card) {
        balance = curr_balance;
        cardIndex = index;
      }
    });

    if (balance === -1) {
      return res.status(400).json({ error: true, message: "Card not found" });
    }

    // Calculate the new balance and accounts
    balance = balance + credit - debit;
    accounts[cardIndex].balance = balance;

    // Update the balance of the user of this card at index cardIndex
    await User.findByIdAndUpdate(userId, {
      $set: {
        accounts: accounts,
      },
    });

    const newExpense = new Expense({
      user: userId,
      date: req.body.date,
      card: req.body.card,
      credit: req.body.credit,
      debit: req.body.debit,
      category: req.body.category,
      notes: req.body.notes,
    });

    newExpense
      .save()
      .then((expense) => {
        Expense.findById(expense._id)
          .populate("card user")
          .then((expense) => res.json(expense));
      })
      .catch((err) => res.status(400).json({ error: "Error: " + err }));
  })();
});

/**
 * @route   GET api/expenses/:id
 * @desc    Get an expense by id
 * @access  Admin
 * @param   {string} id
 *
 * @returns Expense
 */
router.get("/:id", (req, res) => {
  Expense.findById(req.params.id)
    .populate("card user")
    .then((expense) => res.json(expense))
    .catch((err) =>
      res.status(404).json({ error: true, message: "No expense found" })
    );
});

/**
 * @route   GET api/expenses/:year/:month
 * @desc    Get an expense by year and month
 * @access  Public
 * @param   {number} year
 * @param   {number} month
 *
 * @returns [Expenses]
 */
router.get("/:year/:month", (req, res) => {
  (async () => {
    const year = convertToInteger(req.params.year);
    const month =
      convertToInteger(req.params.month) < 10
        ? "0" + req.params.month
        : req.params.month;

    // Create a map of cards and their balances
    const cardsMap = new Map();

    // Get all cards of the user
    await User.find({})
      .populate("accounts.card")
      .then((users) => {
        users[0].accounts.map(({ card, initial_balance }) => {
          cardsMap.set(card._id.toString(), initial_balance);
        });
      });
    // Get all expenses before the month
    await Expense.find({
      date: {
        $lt: `${year}-${month}-01`,
      },
    })
      .then((expenses) => {
        // Calculate the balance at the end of all expenses
        expenses.forEach((expense) => {
          const cardId = expense.card._id.toString();
          const balance = cardsMap.get(cardId);
          const credit = convertToDecimal(expense.credit);
          const debit = convertToDecimal(expense.debit);
          cardsMap.set(cardId, balance + credit - debit);
        });
      })
      .catch((err) =>
        res.status(404).json({ error: true, message: "No expenses found" })
      );
    await Expense.find({
      date: {
        $gte: `${year}-${month}-01`,
        $lte: `${year}-${month}-31`,
      },
    })
      .sort({ date: 1 })
      .populate("card")
      .then((expenses) => {
        let expenses_copy;
        // Calculate running balance of each expense and add it to the expense object
        expenses_copy = expenses.map((expense, index) => {
          const cardId = expense.card._id.toString();
          const balance = cardsMap.get(cardId);
          const credit = convertToDecimal(expense.credit);
          const debit = convertToDecimal(expense.debit);
          const newBalance = balance + credit - debit;
          cardsMap.set(cardId, newBalance);

          return {
            ...expense.toObject(),
            balance: newBalance,
          };
        });

        res.json(expenses_copy);
      })
      .catch((err) => {
        console.error(err);
        res.status(404).json({
          error: true,
          message: "Something went wrong, please try again later.",
        });
      });
  })();
});

/**
 * @route   DELETE api/expenses/:id
 * @desc    Delete an expense with the given id
 * @access  Public
 * @param   {string} id
 *
 * @returns {success: boolean, message: string}
 */
router.delete("/:id", (req, res) => {
  Expense.findById(req.params.id)
    .then((expense) => {
      expense
        .remove()
        .then(() => res.json({ error: false, message: "Deleted" }));
    })
    .catch((err) =>
      res.status(400).json({
        error: true,
        message: "Something went wrong, please try again later.",
      })
    );
});

/**
 * @route DELETE /api/expenses
 * @desc Delete all expenses
 * @access Admin
 *
 * @returns {success: boolean, message: string}
 */
router.delete("/", (req, res) => {
  const { password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      error: true,
      message: "Invalid authentication",
    });
  }

  Expense.deleteMany()
    .then(() => res.json({ error: false, message: "Deleted" }))
    .catch((err) =>
      res.status(400).json({
        error: true,
        message: "Something went wrong, please try again later.",
      })
    );
});

/**
 * @route   PUT api/expenses/:id
 * @desc    Update an expense with the given id
 * @access  Public
 * @param   {string} id
 *
 * @returns {success: boolean, message: string}
 */
router.put("/:id", (req, res) => {
  Expense.findById(req.params.id)
    .then((expense) => {
      expense.date = req.body.date;
      expense.account = req.body.account;
      expense.credit = req.body.credit;
      expense.debit = req.body.debit;
      expense.category = req.body.category;
      expense.notes = req.body.notes;
      expense
        .save()
        .then(() => res.json({ error: false, message: "Updated" }))
        .catch((err) => res.status(400).json({ error: true, message: err }));
    })
    .catch((err) =>
      res.status(400).json({
        error: true,
        message: "Something went wrong, please try again later.",
      })
    );
});

module.exports = router;
