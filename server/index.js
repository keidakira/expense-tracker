const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { configuration } = require("./config/config");

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

// Connect to local mongoDB
mongoose
  .connect(configuration.mongoDB, {
    useNewUrlParser: true,
  })
  .then(() => {
    configuration.env === "prod" && console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error: " + err);
  });

// Routes
const expensesRouter = require("./routes/expenses");
const cardsRouter = require("./routes/cards");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

app.use("/api/expenses", expensesRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

// Health check
app.get("/", (req, res) => {
  res.send("All good! Server is up and running.");
});

// Start server
app.listen(configuration.port, () => {
  console.log("Server started on port " + configuration.port);
});

module.exports = app;
