const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
require("dotenv").config();
const db = require("./db");
const User = require("../models/users.model");

beforeAll(async () => {
  await db.connect();
});
beforeEach(async () => {
  await seed(testData);
});
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("GET /auth/login", () => {
  const username = testData.users[0].username;
  const password = testData.users[0].password;
  it("200: returns a JWT in authorisation header", () => {
    return request(app)
      .post("/auth/login")
      .send({ username, password })
      .expect(200)
      .then(({ body }) => {
        expect(body.token).toEqual(expect.stringMatching(/^JWT/));
      });
  });
  it("401: incorrect password", () => {
    return request(app)
      .post("/auth/login")
      .send({ username, password: "INVALID" })
      .expect(401)
      .then(({ body }) =>
        expect(body.msg).toEqual("Authentication failed: incorrect password")
      );
  });
  it("400: password not supplied", () => {
    return request(app)
      .post("/auth/login")
      .send({ username })
      .expect(400)
      .then(({ body }) =>
        expect(body.msg).toEqual(
          "Bad request: username or password not supplied"
        )
      );
  });
});

describe("GET /auth/register", () => {
  it("201: new user created in database", () => {
    const username = "Jimmy",
      password = "MyS5curePa55wor*";
    const body = { username, password };
    return request(app)
      .post("/auth/register")
      .send(body)
      .expect(201)
      .then(() => User.findOne({ username }))
      .then((user) => expect(user.username).toBe(username));
  });
  it("403: forbidden password (does not meet security requirements)", () => {
    const username = "Jimmy",
      password = "password";
    const body = { username, password };
    return request(app).post("/auth/register").send(body).expect(403);
  });
  it("403: forbidden username (does not meet requirements)", () => {
    const username = "1rj",
      password = "9Rh934r*";
    const body = { username, password };
    return request(app).post("/auth/register").send(body).expect(403);
  });
});
