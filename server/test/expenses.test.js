/**
 * Write all tests related to the route /api/users/:userId/expenses
 */
const chai = require("chai");
const supertest = require("supertest");

const { app, mongoose } = require("../index");

const userDAL = require("../components/user/userDAL");

/**
 * Before all tests, clear expenses collection
 */
before(async () => {
  await mongoose.connection.db.dropCollection("expenses");
  await mongoose.connection.db.createCollection("expenses");
});

describe("Expenses Test", () => {
  /**
   * All tests related to the route GET /api/users/:userId/expenses
   */
  describe("GET /api/users/:userId/expenses", () => {
    /**
     * Before each test, create a new user and save it to the database
     */
    let userId;

    beforeEach(async () => {
      const user = {
        name: "John Doe",
        email: "john@doe.com",
        password: "password",
      };

      const userObject = await userDAL.createUser(user);
      userId = userObject.data.id;
    });

    /**
     * Test the route with invalid userId,
     * then the GET /api/users/:userId/expenses should return,
     * Status: 400,
     * { "error": true, "message": [{"name": "id", "message": ""id is not a valid user id""}] }
     */
    it("should return 400 with invalid userId", async () => {
      const response = await supertest(app).get(
        "/api/users/something/expenses"
      );

      chai.expect(response.status).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.be.an("array");
      chai.expect(response.body.message[0].name).to.equal("id");
      chai
        .expect(response.body.message[0].message)
        .to.equal("id is not a valid user id");
    });

    /**
     * Test the route with valid userId,
     * then the GET /api/users/:userId/expenses should return,
     * Status: 200,
     * {
     *   "error": false,
     *   "data": [],
     *   "message": "Expenses retrieved successfully"
     * }
     */
    it("should return an empty array", async () => {
      const response = await supertest(app).get(
        `/api/users/${userId}/expenses`
      );

      chai.expect(response.status).to.equal(200);
      chai.expect(response.body.error).to.be.false;
      chai.expect(response.body.data).to.be.an("array");
      chai.expect(response.body.data).to.be.empty;
      chai
        .expect(response.body.message)
        .to.equal("Expenses retrieved successfully");
    });
  });

  /**
   * All tests related to the route POST /api/users/:userId/expenses
   */
  describe("POST /api/users/:userId/expenses", () => {
    /**
     * Before each test, create a new user and save it to the database
     */
    let userId;

    beforeEach(async () => {
      const user = {
        name: "John Doe",
        email: "john@doe.com",
        password: "password",
      };

      const userObject = await userDAL.createUser(user);
      userId = userObject.data.id;
    });

    /**
     * Test the route with invalid userId,
     * then the POST /api/users/:userId/expenses should return,
     * Status: 400,
     * { "error": true, "message": [{"name": "id", "message": ""id is not a valid user id""}] }
     */
    it("should return 400 with invalid userId", async () => {
      const response = await supertest(app).post(
        "/api/users/something/expenses"
      );

      chai.expect(response.status).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.be.an("array");
      chai.expect(response.body.message[0].name).to.equal("id");
      chai
        .expect(response.body.message[0].message)
        .to.equal("id is not a valid user id");
    });

    /**
     * Test the route with valid userId, but invalid expense details,
     * then the POST /api/users/:userId/expenses should return,
     * Status: 400,
     * {
          error: true,
          message: [
            { name: 'date', message: 'date is a required field' },
            { name: 'accountId', message: 'accountId is a required field' },
            { name: 'credit', message: 'credit is a required field' },
            { name: 'debit', message: 'debit is a required field' },
            { name: 'category', message: 'category is a required field' }
          ]
        }
     */
    it("should return 400 with invalid expense details", async () => {
      const response = await supertest(app).post(
        `/api/users/${userId}/expenses`
      );

      chai.expect(response.status).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.be.an("array");
      chai.expect(response.body.message[0].name).to.equal("date");
      chai
        .expect(response.body.message[0].message)
        .to.equal("date is a required field");
      chai.expect(response.body.message[1].name).to.equal("accountId");
      chai
        .expect(response.body.message[1].message)
        .to.equal("accountId is a required field");
      chai.expect(response.body.message[2].name).to.equal("credit");
      chai
        .expect(response.body.message[2].message)
        .to.equal("credit is a required field");
      chai.expect(response.body.message[3].name).to.equal("debit");
      chai
        .expect(response.body.message[3].message)
        .to.equal("debit is a required field");
      chai.expect(response.body.message[4].name).to.equal("category");
      chai
        .expect(response.body.message[4].message)
        .to.equal("category is a required field");
    });
  });
});
