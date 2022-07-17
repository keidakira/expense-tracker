/**
 * /api/cards Route
 *
 * @description This route is used for any cards related APIs in the database.
 * @author Srinandan Komanduri
 */
const express = require("express");
const router = express.Router();
const Card = require("../models/Card");

/**
 * @route   GET api/cards
 * @desc    Get all cards
 * @access  Admin
 * @body    {password: string}
 *
 * @returns [Cards]
 */
router.get("/", (req, res) => {
  const { password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      error: true,
      message: "Invalid authentication",
    });
  }

  Card.find()
    .then((cards) => res.json(cards))
    .catch((err) =>
      res.status(404).json({ error: true, message: "No cards found" })
    );
});

/**
 * @route   POST api/cards
 * @desc    Create a card
 * @access  Admin
 * @body    Card, {password: string}
 *
 * @returns Card
 */
router.post("/", (req, res) => {
  const { password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      error: true,
      message: "Invalid authentication",
    });
  }

  const newCard = new Card({
    name: req.body.name,
    company: req.body.company,
    type: req.body.type,
  });
  newCard
    .save()
    .then((card) => res.json(card))
    .catch((err) => res.status(400).json({ error: "Error: " + err }));
});

/**
 * @route   GET api/cards/:id
 * @desc    Get a card by id
 * @access  Admin
 * @param   {string} id
 * @body    {password: string}
 *
 * @returns Card
 */
router.get("/:id", (req, res) => {
  const { password } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      error: true,
      message: "Invalid authentication",
    });
  }

  Card.findById(req.params.id)
    .then((card) => res.json(card))
    .catch((err) =>
      res.status(404).json({ error: true, message: "No card found" })
    );
});

module.exports = router;
