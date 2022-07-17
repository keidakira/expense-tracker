// This file is used to test the expenses API endpoint using supertest and mocha.
const request = require("supertest");
const app = require("../index");
const expect = require("chai").expect;
const Expense = require("../models/Expense");
const mockExpenses = require("../data/test-expenses.json");

const { dateObjectFromString } = require("../utils/date");

describe("Expenses", () => {
  beforeEach(() => {
    Expense.deleteMany({}, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });
  /*
   * GET request
   */
  it("GET /api/expenses when DB is empty", (done) => {
    request(app)
      .get("/api/expenses")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(0);
        done();
      });
  }).timeout(10000);

  it("GET /api/expenses/:id Get expense by _id", (done) => {
    const expense = new Expense(mockExpenses[0]);
    expense.save((err, expense) => {
      if (err) return done(err);
      request(app)
        .get(`/api/expenses/${expense._id}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("_id");
          expect(res.body).to.have.property("date");
          expect(res.body).to.have.property("credit");
          expect(res.body).to.have.property("debit");
          expect(res.body).to.have.property("notes");
          expect(res.body).to.have.property("category");
          expect(res.body).to.have.property("account");
          done();
        });
    });
  });

  it("GET /api/expenses/:id with invalid _id", (done) => {
    request(app)
      .get("/api/expenses/123")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("error").to.equal(true);
        expect(res.body)
          .to.have.property("message")
          .to.equal("No expense found");
        done();
      });
  });

  it("GET /api/expenses/:year/:month Get expenses from a certain month and year", (done) => {
    const expense = new Expense(mockExpenses[0]);
    const date = dateObjectFromString(mockExpenses[0].date);
    expense.save((err, data) => {
      if (err) return done(err);
      request(app)
        .get(`/api/expenses/${date.getFullYear()}/${date.getMonth() + 1}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.have.property("_id");
          expect(res.body[0]).to.have.property("date");
          expect(res.body[0]).to.have.property("credit");
          expect(res.body[0]).to.have.property("debit");
          expect(res.body[0]).to.have.property("notes");
          expect(res.body[0]).to.have.property("category");
          expect(res.body[0]).to.have.property("account");
          done();
        });
    });
  }).timeout(10000);

  it("GET /api/expenses/:year/:month with no data year and month", (done) => {
    request(app)
      .get("/api/expenses/2040/1")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(0);
        done();
      });
  }).timeout(10000);

  /*
   * All POST requests
   */
  it("POST /api/expenses when DB is empty", (done) => {
    request(app)
      .post("/api/expenses")
      .send(mockExpenses[0])
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("date");
        expect(res.body).to.have.property("credit");
        expect(res.body).to.have.property("debit");
        expect(res.body).to.have.property("notes");
        expect(res.body).to.have.property("category");
        expect(res.body).to.have.property("account");
        done();
      });
  }).timeout(10000);

  it("POST  /api/expenses duplicate expenses should exist", (done) => {
    request(app)
      .post("/api/expenses")
      .send(mockExpenses[0])
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("_id");
        expect(res.body).to.have.property("date");
        expect(res.body).to.have.property("credit");
        expect(res.body).to.have.property("debit");
        expect(res.body).to.have.property("notes");
        expect(res.body).to.have.property("category");
        expect(res.body).to.have.property("account");
        done();
      });
  }).timeout(10000);

  /**
   * PUT Request
   */
  it("PUT /api/expenses/:id Update expense by _id", (done) => {
    const expense = new Expense(mockExpenses[0]);
    expense.save((err, expense) => {
      if (err) return done(err);
      request(app)
        .put(`/api/expenses/${expense._id}`)
        .send(mockExpenses[1])
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("error").to.equal(false);
          expect(res.body).to.have.property("message").to.equal("Updated");
          done();
        });
    });
  });

  it("PUT /api/expenses/:id Update expense with invalid _id", (done) => {
    request(app)
      .put("/api/expenses/123")
      .send(mockExpenses[1])
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("error").to.equal(true);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Something went wrong, please try again later.");
        done();
      });
  }).timeout(10000);

  /**
   * DELETE Request
   * */
  it("DELETE /api/expenses/:id Delete expense by _id", (done) => {
    const expense = new Expense(mockExpenses[0]);
    expense.save((err, expense) => {
      if (err) return done(err);
      request(app)
        .delete(`/api/expenses/${expense._id}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("error").to.equal(false);
          expect(res.body).to.have.property("message").to.equal("Deleted");
          done();
        });
    });
  });

  it("DELETE /api/expenses/:id Delete expense with invalid _id", (done) => {
    request(app)
      .delete("/api/expenses/123")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("error").to.equal(true);
        expect(res.body)
          .to.have.property("message")
          .to.equal("Something went wrong, please try again later.");
        done();
      });
  });
});
