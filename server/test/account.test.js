/**
 * Write all tests related to /accounts route
 */
const chai = require("chai");
const supertest = require("supertest");

const { app, mongoose } = require("../index");

/**
 * Before all tests, clear entire database
 */
before(async () => {
  await mongoose.connection.dropCollection("accounts");
  await mongoose.connection.createCollection("accounts");
});

/**
 * All tests for GET /api/accounts route
 */
describe("GET /api/accounts", () => {
  /** When no accounts are in the database,
   * the GET /api/accounts should return the following response:
   * Status: 200
   * {
        "error": false,
        "data": [],
        "message": "Accounts retrieved successfully"
    }
   */
  it("should return an empty array", async () => {
    const response = await supertest(app).get("/api/accounts");

    chai.expect(response.status).to.equal(200);
    chai.expect(response.body.error).to.be.false;
    chai.expect(response.body.data).to.be.an("array");
    chai.expect(response.body.data).to.be.empty;
    chai
      .expect(response.body.message)
      .to.equal("Accounts retrieved successfully");
  }).timeout(5000);
}); // end of describe

/**
 * All tests for POST /api/accounts route
 */
describe("POST /api/accounts", () => {
  /**
   * When a new account is created with valid information,
   * the POST /api/accounts should return the following response:
   * {
   *    "error": false,
   *    "data": {
   *        "id": "62e0bf2a680ff66b6b593d92",
   *        "name": "Bank of America",
   *        "type": "Credit",
   *        "color": "#abcdef"
   *    }
   *    "message": "Account created successfully"
   * }
   */
  it("should return a new account", async () => {
    const response = await supertest(app).post("/api/accounts").send({
      name: "Bank of America",
      type: "Credit",
      color: "#abcdef",
    });

    chai.expect(response.statusCode).to.equal(201);
    chai.expect(response.body.error).to.be.false;
    chai.expect(response.body.data).to.be.an("object");
    chai.expect(response.body.data.id).to.be.a("string");
    chai.expect(response.body.data.name).to.equal("Bank of America");
    chai.expect(response.body.data.type).to.equal("Credit");
    chai.expect(response.body.data.color).to.equal("#abcdef");
    chai.expect(response.body.message).to.equal("Account created successfully");
  }).timeout(5000);

  /**
   * When a new account is created with invalid type,
   * the POST /api/accounts should return the following response:
   * Status code: 400
   * {
        "error": true,
        "message": [
            {
                "name": "type",
                "message": "type must be either Credit or Debit"
            }
        ]
    }
   */
  it("should return an error when type is invalid", async () => {
    const response = await supertest(app).post("/api/accounts").send({
      name: "Bank of America",
      type: "Invalid",
      color: "#abcdef",
    });

    chai.expect(response.statusCode).to.equal(400);
    chai.expect(response.body.error).to.be.true;
    chai.expect(response.body.message).to.be.an("array");
    chai.expect(response.body.message[0].name).to.equal("type");
    chai
      .expect(response.body.message[0].message)
      .to.equal("type must be either Credit or Debit");
  }).timeout(5000);

  /**
   * When a new account is created with invalid color,
   * the POST /api/accounts should return the following response:
   * Status code: 400
   * {
        "error": true,
        "message": [
            {
                "name": "color",
                "message": "color must be a valid hex color"
            }
        ]
    }
   */
  it("should return an error when color is invalid", async () => {
    const response = await supertest(app).post("/api/accounts").send({
      name: "Bank of America",
      type: "Credit",
      color: "Invalid",
    });

    chai.expect(response.statusCode).to.equal(400);
    chai.expect(response.body.error).to.be.true;
    chai.expect(response.body.message).to.be.an("array");
    chai.expect(response.body.message[0].name).to.equal("color");
    chai
      .expect(response.body.message[0].message)
      .to.equal("color must be a valid hex color");
  }).timeout(5000);

  /**
   * When a new account is created with invalid type and color,
   * the POST /api/accounts should return the following response:
   * Status code: 400
   * {
        "error": true,
        "message": [
            {
                "name": "type",
                "message": "type must be either Credit or Debit"
            },
            {
                "name": "color",
                "message": "color must be a valid hex color"
            }
        ]
    }
   */
  it("should return an error when type and color are invalid", async () => {
    const response = await supertest(app).post("/api/accounts").send({
      name: "Bank of America",
      type: "Invalid",
      color: "Invalid",
    });

    chai.expect(response.statusCode).to.equal(400);
    chai.expect(response.body.error).to.be.true;
    chai.expect(response.body.message).to.be.an("array");
    chai.expect(response.body.message[0].name).to.equal("type");
    chai
      .expect(response.body.message[0].message)
      .to.equal("type must be either Credit or Debit");
    chai.expect(response.body.message[1].name).to.equal("color");
    chai
      .expect(response.body.message[1].message)
      .to.equal("color must be a valid hex color");
  }).timeout(5000);

  /**
   * When a new account is created with no body provided,
   * the POST /api/accounts should return the following response:
   * Status code: 400
   * {
        "error": true,
        "message": [
            {
                "name": "name",
                "message": "name is a required field"
            },
            {
                "name": "type",
                "message": "type is a required field"
            },
            {
                "name": "color",
                "message": "color is a required field"
            }
        ]
    }
   */
  it("should return an error when no body is provided", async () => {
    const response = await supertest(app).post("/api/accounts");

    chai.expect(response.statusCode).to.equal(400);
    chai.expect(response.body.error).to.be.true;
    chai.expect(response.body.message).to.be.an("array");
    chai.expect(response.body.message[0].name).to.equal("name");
    chai
      .expect(response.body.message[0].message)
      .to.equal("name is a required field");
    chai.expect(response.body.message[1].name).to.equal("type");
    chai
      .expect(response.body.message[1].message)
      .to.equal("type is a required field");
    chai.expect(response.body.message[2].name).to.equal("color");
    chai
      .expect(response.body.message[2].message)
      .to.equal("color is a required field");
  }).timeout(5000);
}); // end of describe

/**
 * Test for GET /api/accounts after creating a new account
 */
describe("GET /api/accounts after creating an new account", () => {
  /**
     * When a new account is created,
     * the GET /api/accounts should return the following response:
     * Status code: 200
     * {
            "error": false,
            "data": [
                {
                    "id": "62e0c34d4e7f51fcd61a18a6",
                    "name": "Bank of America",
                    "type": "Credit",
                    "color": "#abcdef"
                }
            ],
            "message": "Accounts retrieved successfully"
        }
     */
  it("should return the created account", async () => {
    const response = await supertest(app).get("/api/accounts");

    chai.expect(response.statusCode).to.equal(200);
    chai.expect(response.body.error).to.be.false;
    chai.expect(response.body.data).to.be.an("array");
    chai.expect(response.body.data[0].id).to.be.a("string");
    chai.expect(response.body.data[0].name).to.equal("Bank of America");
    chai.expect(response.body.data[0].type).to.equal("Credit");
    chai.expect(response.body.data[0].color).to.equal("#abcdef");
    chai
      .expect(response.body.message)
      .to.equal("Accounts retrieved successfully");
  }).timeout(5000);
}); // end of describe
