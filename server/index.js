const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { configuration } = require("./config/config");

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
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
// const expensesRouter = require("./components/expense/expenseRoutes");
const accountsRouter = require("./components/account/accountRoutes");
const usersRouter = require("./components/user/userRoutes");
const authRouter = require("./components/auth/authRoutes");

// app.use("/api/expenses", expensesRouter);
app.use("/api/accounts", accountsRouter);
app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);

// Health check
app.get("/", (req, res) => {
  res.send("All good! Server is up and running.");
});

// All others routes go to 404
app.all("*", (req, res) => {
  res.status(404).send("404 Not Found");
});

// Start server
app.listen(configuration.port, () => {
  console.log("Server started on port " + configuration.port);
});

module.exports = {
  app,
  mongoose,
};
