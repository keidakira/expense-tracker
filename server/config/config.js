// Use dotenv
require("dotenv").config();

let env = process.env.NODE_ENV;
let mongoDB;

if (env === "test") {
  mongoDB = process.env.MONGO_DB_TEST;
} else {
  mongoDB = process.env.MONGO_DB_PROD;
}

const configuration = {
  env,
  mongoDB,
  port: process.env.PORT,
};

module.exports = {
  configuration,
};
