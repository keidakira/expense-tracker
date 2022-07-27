/**
 * Write all tests related to /accounts route
 */
const chai = require("chai");
const supertest = require("supertest");

const { app, mongoose } = require("../index");
const { getTomorrowDate, getNewDate } = require("../utils/date");

/**
 * Before all tests, clear entire database
 */
before(async () => {
  await mongoose.connection.dropCollection("users");
  await mongoose.connection.createCollection("users");
});

let userId, accountId;

describe("Users Test", () => {
  /**
   * All tests for POST /api/users route
   */
  describe("POST /api/users", () => {
    /**
   * When trying to create a new user with no fields at all,
   * the POST /api/users should return the following response:
   * Status: 400
   * {
        "error": true,
        "message": [
            {
                "name": "name",
                "message": "name is a required field"
            },
            {
                "name": "email",
                "message": "email is a required field"
            },
            {
                "name": "password",
                "message": "password is a required field"
            }
        ]
      }
   */
    it("should return error, saying fields are required", async () => {
      const response = await supertest(app).post("/api/users");

      chai.expect(response.status).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.be.an("array");
      chai.expect(response.body.message).to.have.lengthOf(3);
      chai.expect(response.body.message[0].name).to.equal("name");
      chai
        .expect(response.body.message[0].message)
        .to.equal("name is a required field");
      chai.expect(response.body.message[1].name).to.equal("email");
      chai
        .expect(response.body.message[1].message)
        .to.equal("email is a required field");
      chai.expect(response.body.message[2].name).to.equal("password");
      chai
        .expect(response.body.message[2].message)
        .to.equal("password is a required field");
    }).timeout(5000);

    /**
   * When trying to create a new user with invalid email,
   * the POST /api/users should return the following response:
   * Status: 400
   * {
        "error": true,
        "message": [
            {
                "name": "email",
                "message": "email is invalid"
            }
        ]
    }
   */
    it("should return error, saying email is invalid", async () => {
      const response = await supertest(app).post("/api/users").send({
        name: "John Doe",
        email: "invalid",
        password: "password",
      });

      chai.expect(response.status).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.be.an("array");
      chai.expect(response.body.message).to.have.lengthOf(1);
      chai.expect(response.body.message[0].name).to.equal("email");
      chai
        .expect(response.body.message[0].message)
        .to.equal("email is invalid");
    }).timeout(5000);

    /**
   * When trying to create a new user with valid information,
   * the POST /api/users should return the following response:
   * Status: 201
   * {
        "error": false,
        "data": {
            "id": "62e113c75cc3f65f79e1094b",
            "name": "John Doe",
            "email": "test@test.com",
            "accounts": []
        },
        "message": "User created successfully"
    }
   */
    it("should return success, saying user created successfully", async () => {
      const response = await supertest(app).post("/api/users").send({
        name: "John Doe",
        email: "test@test.com",
        password: "password",
      });

      userId = response.body.data.id;

      chai.expect(response.status).to.equal(201);
      chai.expect(response.body.error).to.be.false;
      chai.expect(response.body.data).to.be.an("object");
      chai.expect(response.body.data.id).to.be.a("string");
      chai.expect(response.body.data.name).to.equal("John Doe");
      chai.expect(response.body.data.email).to.equal("test@test.com");
      chai.expect(response.body.data.accounts).to.be.an("array");
      chai.expect(response.body.data.accounts).to.have.lengthOf(0);
      chai.expect(response.body.message).to.equal("User created successfully");
    }).timeout(5000);

    /**
   * When trying to create a new user with existing email,
   * the POST /api/users should return the following response:
   * Status: 400
   * {
        "error": true,
        "message": "User already exists"
    }
   */
    it("should return error, saying user already exists", async () => {
      const response = await supertest(app).post("/api/users").send({
        name: "John Doe",
        email: "test@test.com",
        password: "password",
      });

      chai.expect(response.status).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.equal("User already exists");
    }).timeout(5000);
  }); // end of describe

  /**
   * All tests for GET /api/users/:id route
   */
  describe("GET /api/users/:id", () => {
    /**
   * When trying to get a user with non id param,
   * the GET /api/users/:id should return the following response:
   * Status: 400
   * {
        "error": true,
        "message": [
            {
                "name": "id",
                "message": "id is not a valid ObjectId"
            }
        ]
    }
   */
    it("should return error, saying id is invalid objectid", async () => {
      const response = await supertest(app).get("/api/users/invalid");

      chai.expect(response.status).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.be.an("array");
      chai.expect(response.body.message).to.have.lengthOf(1);
      chai.expect(response.body.message[0].name).to.equal("id");
      chai
        .expect(response.body.message[0].message)
        .to.equal("id is not a valid ObjectId");
    }).timeout(5000);

    /**
   * When trying to get a user with non existing id,
   * the GET /api/users/:id should return the following response:
   * Status: 400
   * {
        "error": true,
        "message": "User does not exist"
   * }
   */
    it("should return error, saying user does not exist", async () => {
      const response = await supertest(app).get(
        "/api/users/5e8f8f8f8f8f8f8f8f8f8f8f"
      );

      chai.expect(response.status).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.equal("User does not exist");
    }).timeout(5000);

    /**
   * When trying to get a user with valid id,
   * the GET /api/users/:id should return the following response:
   * Status: 200
   * {
        "error": false,
        "data": {
            "id": "62e113c75cc3f65f79e1094b",
            "name": "John Doe",
            "email": "test@gmail.com",
            "accounts": []
        },
        "message": "User retrieved successfully"
    }
    */
    it("should return success, saying User retrieved successfully", async () => {
      const response = await supertest(app).get("/api/users/" + userId);

      chai.expect(response.status).to.equal(200);
      chai.expect(response.body.error).to.be.false;
      chai.expect(response.body.data).to.be.an("object");
      chai.expect(response.body.data.id).to.equal(userId);
      chai.expect(response.body.data.name).to.equal("John Doe");
      chai.expect(response.body.data.email).to.equal("test@test.com");
      chai.expect(response.body.data.accounts).to.be.an("array");
      chai.expect(response.body.data.accounts).to.have.lengthOf(0);
      chai
        .expect(response.body.message)
        .to.equal("User retrieved successfully");
    }).timeout(5000);
  }); // end of describe

  /**
   * All tests for POST /api/users/:id/accounts
   */
  describe("POST /api/users/:id/accounts", () => {
    /**
   * When trying to add an account with no details,
   * POST /api/users/:id/accounts response should be:
   * Status: 400
   * {
        "error": true,
        "message": [
            {
                "name": "accountId",
                "message": "accountId is a required field"
            },
            {
                "name": "initialBalance",
                "message": "initialBalance is a required field"
            },
            {
                "name": "dateOfInitialBalance",
                "message": "dateOfInitialBalance is a required field"
            }
        ]
    }
   */
    it("should return error, saying all fields are required", async () => {
      const response = await supertest(app).post(
        "/api/users/" + userId + "/accounts"
      );

      chai.expect(response.statusCode).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.be.an("array");
      chai.expect(response.body.message).to.have.length(3);
      for (let i = 0; i < 3; i++) {
        chai.expect(response.body.message[i]).to.be.an("object");
      }
      chai.expect(response.body.message[0].name).to.equal("accountId");
      chai
        .expect(response.body.message[0].message)
        .to.equal("accountId is a required field");
      chai.expect(response.body.message[1].name).to.equal("initialBalance");
      chai
        .expect(response.body.message[1].message)
        .to.equal("initialBalance is a required field");
      chai
        .expect(response.body.message[2].name)
        .to.equal("dateOfInitialBalance");
      chai
        .expect(response.body.message[2].message)
        .to.equal("dateOfInitialBalance is a required field");
    }).timeout(500);

    /**
   * When the accountId is not a valid account object id,
   * then POST /api/users/:id/accounts will return the response:
   * Status: 400
   * {
        "error": true,
        "message": [
            {
                "name": "accountId",
                "message": "accountId is not a valid ObjectId"
            }
        ]
    }
   */
    it("should return error saying invalid accountId", async () => {
      const response = await supertest(app)
        .post("/api/users/" + userId + "/accounts")
        .send({
          accountId: "invalid",
          initialBalance: 100,
          dateOfInitialBalance: "2020-01-01",
        });

      chai.expect(response.statusCode).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.be.an("array");
      chai.expect(response.body.message[0]).to.be.an("object");
      chai.expect(response.body.message[0].name).to.equal("accountId");
      chai
        .expect(response.body.message[0].message)
        .to.equal("accountId is not a valid ObjectId");
    }).timeout(500);

    /**
   * When the accountId is an wrong account object id,
   * then POST /api/users/:id/accounts will return the response:
   * Status: 400
   * {
        "error": true,
        "message": "Account not found"
    }
   */
    it("should return error saying account not found", async () => {
      const response = await supertest(app)
        .post("/api/users/" + userId + "/accounts")
        .send({
          accountId: "5e8f8f8f8f8f8f8f8f8f8f8f",
          initialBalance: 100,
          dateOfInitialBalance: "2020-01-01",
        });

      chai.expect(response.statusCode).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.equal("Account not found");
    }).timeout(500);

    /**
   * When the userId is not valid while adding an account,
   * then POST /api/users/:id/accounts will return the response:
   * Status: 400
   * {
        "error": true,
        "message": "User not found"
    }
   */
    it("should return error saying user not found", async () => {
      const response = await supertest(app)
        .post("/api/users/5e8f8f8f8f8f8f8f8f8f8f8f/accounts")
        .send({
          accountId: "62e1d9fbf98399b7cb2451b8",
          initialBalance: 100,
          dateOfInitialBalance: "2020-01-01",
        });

      chai.expect(response.statusCode).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.equal("User not found");
    }).timeout(500);

    /**
   * When the initialBalance is a negative number,
   * then POST /api/users/:id/accounts will return the response:
   * Status: 400
   * {
      "error": true,
      "message": [
        {
          "name": "initialBalance",
          "message": "initialBalance must be positive"
        }
      ]
   * }
   */
    it("should return error saying initialBalance must be a positive number", async () => {
      const accountResponse = await supertest(app).get("/api/accounts");
      accountId = accountResponse.body.data[0].id;
      const response = await supertest(app)
        .post("/api/users/" + userId + "/accounts")
        .send({
          accountId: accountId,
          initialBalance: -100,
          dateOfInitialBalance: "2020-01-01",
        });

      chai.expect(response.statusCode).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.be.an("array");
      chai.expect(response.body.message[0]).to.be.an("object");
      chai.expect(response.body.message[0].name).to.equal("initialBalance");
      chai
        .expect(response.body.message[0].message)
        .to.equal("initialBalance must be positive");
    }).timeout(500);

    /**
   * When the dateOfInitialBalance is in the future,
   * then POST /api/users/:id/accounts will return the response:
   * Status: 400
   * {
        "error": true,
        "message": [
            {
                "name": "dateOfInitialBalance",
                "message": "dateOfInitialBalance cannot be in the future"
            }
        ]
    }
   */
    it("should return error saying dateOfInitialBalance cannot be in the future", async () => {
      const response = await supertest(app)
        .post("/api/users/" + userId + "/accounts")
        .send({
          accountId: accountId,
          initialBalance: 100,
          dateOfInitialBalance: getTomorrowDate(),
        });

      chai.expect(response.statusCode).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.be.an("array");
      chai.expect(response.body.message[0]).to.be.an("object");
      chai
        .expect(response.body.message[0].name)
        .to.equal("dateOfInitialBalance");
      chai
        .expect(response.body.message[0].message)
        .to.equal("dateOfInitialBalance cannot be in the future");
    }).timeout(500);

    /**
   * When all the information is correct, add an account to the user
   * then POST /api/users/:id/accounts will return the response:
   * Status: 201
   * {
        "error": false,
        "data": {
            "id": "62e1e0a44e047c284526b6bc",
            "name": "John Doe",
            "email": "test@test.com",
            "accounts": [
                {
                    "accountId": "62e1e0a44e047c284526b6b8",
                    "initialBalance": 123,
                    "currentBalance": 123,
                    "dateOfInitialBalance": "2021-07-26T00:00:00.000Z",
                }
            ]
        },
        "message": "Account added successfully"
    }
   */
    it("should return success message saying account added successfully", async () => {
      const body = {
        accountId: accountId,
        initialBalance: 1412,
        dateOfInitialBalance: getNewDate(),
      };
      const response = await supertest(app)
        .post("/api/users/" + userId + "/accounts")
        .send(body);

      chai.expect(response.statusCode).to.equal(201);
      chai.expect(response.body.error).to.be.false;
      chai.expect(response.body.data).to.be.an("object");
      chai.expect(response.body.data.id).to.be.a("string");
      chai.expect(response.body.data.name).to.equal("John Doe");
      chai.expect(response.body.data.email).to.equal("test@test.com");
      chai.expect(response.body.data.accounts).to.be.an("array");
      chai.expect(response.body.data.accounts[0].accountId).to.be.a("string");
      chai.expect(response.body.data.accounts[0].accountId).to.equal(accountId);
      chai
        .expect(response.body.data.accounts[0].initialBalance)
        .to.equal(body.initialBalance);
      chai
        .expect(response.body.data.accounts[0].currentBalance)
        .to.equal(body.initialBalance);
      chai
        .expect(response.body.data.accounts[0].dateOfInitialBalance)
        .to.equal(body.dateOfInitialBalance);
      chai.expect(response.body.message).to.equal("Account added successfully");
    }).timeout(500);

    /**
     * When the user already has an account with the same accountId,
     * then POST /api/users/:id/accounts will return the response:
     * Status: 400
     * {
     *    "error": true,
     *    "message": "User already has an account with this accountId"
     * }
     */
    it("should return error saying user already has an account with this accountId", async () => {
      const body = {
        accountId: accountId,
        initialBalance: 1412,
        dateOfInitialBalance: getNewDate(),
      };
      const response = await supertest(app)
        .post("/api/users/" + userId + "/accounts")
        .send(body);

      chai.expect(response.statusCode).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai
        .expect(response.body.message)
        .to.equal("User already has an account with this accountId");
    }).timeout(500);
  }); // describe ends
});
