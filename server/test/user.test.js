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
  await mongoose.connection.dropCollection("users");
  await mongoose.connection.createCollection("users");
});

let userId;

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
    chai.expect(response.body.message[0].message).to.equal("email is invalid");
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
    chai.expect(response.body.message).to.equal("User retrieved successfully");
  }).timeout(5000);
}); // end of describe
