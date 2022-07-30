/**
 * Write all tests related to /api/auth route
 */
const chai = require("chai");
const supertest = require("supertest");

const { app, mongoose } = require("../index");

const userDAL = require("../components/user/userDAL");

/**
 * Before all tests, clear entire collection
 */
before(async () => {
  await mongoose.connection.dropCollection("users");
  await mongoose.connection.createCollection("users");
});

describe("Auth Test", async () => {
  // Create a new user with email: john@doe.com and password: password
  const user = {
    email: "john@doe.com",
    password: "password",
  };

  const userObject = await userDAL.createUser(user);
  if (userObject.error) {
    throw new Error(userObject.message);
  }
  /**
   * All tests for POST /api/auth route
   */
  describe("POST /api/auth", () => {
    /**
         * When user tries to login with no credentials,
         * the POST /api/auth should return the following response:
         * {
                "error": true,
                "message": [
                    {
                        "name": "email",
                        "message": "email is a required field"
                    },
                    {
                        "name": "password",
                        "message": "\"password\" is required"
                    }
                ]
            }
         */
    it("should return an error when no credentials are provided", async () => {
      const response = await supertest(app).post("/api/auth/login");

      chai.expect(response.status).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.be.an("array");
      chai.expect(response.body.message).to.have.lengthOf(2);
      chai.expect(response.body.message[0].name).to.equal("email");
      chai
        .expect(response.body.message[0].message)
        .to.equal("email is a required field");
      chai.expect(response.body.message[1].name).to.equal("password");
      chai
        .expect(response.body.message[1].message)
        .to.equal("password is required");
    });

    /**
     * When user tries to login with correct email, but wrong password,
     * the POST /api/auth should return the following response:
     * {
            "error": true,
            "message": "Invalid password"
        }
     */
    it("should return an error when wrong password is provided", async () => {
      const response = await supertest(app).post("/api/auth/login").send({
        email: "john@doe.com",
        password: "wrong password",
      });

      chai.expect(response.status).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.equal("Invalid password");
    });

    /**
     * When user tries to login with invalid email format,
     * the POST /api/auth should return the following response:
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
    it("should return an error when invalid email is provided", async () => {
      const response = await supertest(app).post("/api/auth/login").send({
        email: "invalid email",
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
    });

    /**
     * When user tries to login with non-existing email,
     * the POST /api/auth should return the following response:
     * {
            "error": true,
            "message": "User does not exist"
        }
     */
    it("should return an error when non-existing email is provided", async () => {
      const response = await supertest(app).post("/api/auth/login").send({
        email: "nouser@kk.com",
        password: "password",
      });

      chai.expect(response.status).to.equal(400);
      chai.expect(response.body.error).to.be.true;
      chai.expect(response.body.message).to.equal("User does not exist");
    });

    /**
     * When user tries to login with correct email and password,
     * the POST /api/auth should return the following response:
     * {
            "error": false,
            "data": {
                "id": "62e427151c63f52e91ea3cf5",
                "name": "John Doe",
                "email": "john@doe.com",
                "accounts": []
            },
            "message": "User logged in successfully"
        }
     */
    it("should return a success message when correct credentials are provided", async () => {
      const response = await supertest(app).post("/api/auth/login").send({
        email: "john@doe.com",
        password: "password",
      });

      chai.expect(response.status).to.equal(200);
      chai.expect(response.body.error).to.be.false;
      chai.expect(response.body.data).to.be.an("object");
      chai.expect(response.body.data.id).to.be.a("string");
      chai.expect(response.body.data.name).to.be.a("string");
      chai.expect(response.body.data.email).to.be.a("string");
      chai.expect(response.body.data.accounts).to.be.an("array");
      chai
        .expect(response.body.message)
        .to.equal("User logged in successfully");
    });
  });
});
