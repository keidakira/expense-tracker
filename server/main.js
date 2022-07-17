const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const { months } = require("./utils/constants");
const { convertToInteger } = require("./utils/mathf");
const { dateObjectFromString } = require("./utils/date.js");
const { v4: uuidv4 } = require("uuid");

app.use(
  cors({
    origin: "http://localhost*",
  })
);
app.use(express.json());

const insertYear = (newData) => {
  let data = readDB();
  data.items.push(newData);

  fs.writeFileSync(__dirname + "/data/transactions.json", JSON.stringify(data));

  return data;
};

const insertMonth = (newData, year) => {
  let data = readDB();
  let yearIndex = data.items.findIndex((item) => {
    return item.year === year;
  });

  data["items"][yearIndex]["months"].push(newData);

  fs.writeFileSync(__dirname + "/data/transactions.json", JSON.stringify(data));

  return data;
};

const insertDay = (newData, year, month) => {
  let data = readDB();
  let yearIndex = data.items.findIndex((item) => {
    return item.year === year;
  });
  let monthIndex = data["items"][yearIndex]["months"].findIndex((item) => {
    return item.month === month;
  });

  data["items"][yearIndex]["months"][monthIndex]["transactions"].push(newData);

  fs.writeFileSync(__dirname + "/data/transactions.json", JSON.stringify(data));

  return data;
};

const insertTransaction = (newData, year, month, date) => {
  let data = readDB();
  let yearIndex = data.items.findIndex((item) => {
    return item.year === year;
  });
  let monthIndex = data["items"][yearIndex]["months"].findIndex((item) => {
    return item.month === month;
  });
  let dayIndex = data["items"][yearIndex]["months"][monthIndex][
    "transactions"
  ].findIndex((item) => {
    return dateObjectFromString(item.date).getDate() === date;
  });

  data["items"][yearIndex]["months"][monthIndex]["transactions"][dayIndex][
    "transactions"
  ].push(newData);

  fs.writeFileSync(__dirname + "/data/transactions.json", JSON.stringify(data));

  return data;
};

const createYearTransaction = (transaction) => {
  let date = dateObjectFromString(transaction.date);
  let data = {};
  data["year"] = date.getFullYear();
  month = createMonthTransaction(transaction);
  data["months"] = [month];

  return data;
};

const createMonthTransaction = (transaction) => {
  let date = dateObjectFromString(transaction.date);
  let data = {};
  data["month"] = months[date.getMonth()];
  data["transactions"] = [createDayTrasaction(transaction)];

  return data;
};

const createDayTrasaction = (transaction) => {
  let date = dateObjectFromString(transaction.date);
  let data = {};
  data["date"] = date;
  data["transactions"] = [{ ...transaction, id: uuidv4() }];

  return data;
};

app.get("/transactions", function (req, res) {
  const data = readDB();
  res.json(data);
});

app.get("/transactions/:year/:month", (req, res) => {
  const year = convertToInteger(req.params.year);
  const month = req.params.month;
  const data = readDB();
  let response = {};

  const yearIndex = data.items.findIndex((item) => {
    return item.year === year;
  });
  if (yearIndex !== -1) {
    const monthIndex = data["items"][yearIndex]["months"].findIndex((item) => {
      return item.month === month;
    });

    if (monthIndex !== -1) {
      response = data["items"][yearIndex]["months"][monthIndex]["transactions"];
    }
  }

  res.json(response);
});

app.post("/transactions", (req, res) => {
  const transaction = req.body;
  const data = readDB();
  let response = "Normal";
  const date = dateObjectFromString(transaction.date);

  // Find the year
  const year = data.items.find((year) => year.year === date.getFullYear());

  if (year === undefined) {
    console.log("Year not found");
    // No transaction exists in that year, so create one
    const newData = createYearTransaction(transaction);
    response = insertYear(newData);
  } else {
    // Find the month
    const month = year.months.find(
      (month) => month.month === months[date.getMonth()]
    );
    if (month === undefined) {
      console.log("Month not found");
      // No transaction exists in that month, so create one
      const newData = createMonthTransaction(transaction);
      response = insertMonth(newData, year.year);
    } else {
      // Find the day
      const day = month.transactions.find(
        (day) => dateObjectFromString(day.date).getDate() === date.getDate()
      );
      if (day === undefined) {
        console.log("Day not found");
        // No transaction exists in that day, so create one
        const newData = createDayTrasaction(transaction);
        response = insertDay(newData, year.year, month.month);
      } else {
        // Transaction exists, so add it to the list
        response = insertTransaction(
          transaction,
          year.year,
          month.month,
          dateObjectFromString(day.date).getDate()
        );
      }
    }
  }

  res.send(response);
});

const server = app.listen(8081, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
