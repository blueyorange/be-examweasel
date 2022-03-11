const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
require("dotenv").config();
const db = require("./db");
const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
let token = "NO TOKEN";

beforeAll(async () => {
  await db.connect();
  await seed(testData);
  const username = testData.users[0].username;
  const password = testData.users[0].password;
  const { body } = await request(app)
    .post("/auth/login")
    .send({ username, password })
    .expect(200);
  token = body.token.split(" ")[1];
});
beforeEach(async () => {});
afterEach(async () => {});
afterAll(async () => {
  await db.clearDatabase();
  await db.closeDatabase();
});

describe("GET /", () => {
  it("200: displays welcome message", () => {
    return request(app).get("/").expect(200);
  });
});

describe("GET /api", () => {
  it("200: serves a description of the api after auth using username and password", async () => {
    return request(app)
      .get("/api")
      .set(tokenHeaderKey, `Bearer ${token}`)
      .expect(200);
  });
  it("401: unauthorised with invalid token", async () => {
    const token = "INVALID.TOKEN";
    return request(app)
      .get("/api")
      .set(tokenHeaderKey, `Bearer ${token}`)
      .expect(401);
  });
});

describe("GET /api/users", () => {
  it("200: returns an array", () => {
    return request(app)
      .get("/api/users")
      .set(tokenHeaderKey, `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ username: expect.any(String) }),
          ])
        );
      });
  });
  it("401: unauthorized for invalid token", () => {
    return request(app)
      .get("/api/users")
      .set(tokenHeaderKey, `Bearer INVALID.TOKEN.HERE`)
      .expect(401);
  });
});

describe("GET /api/users/:username", () => {
  const username = testData.users[0].username;
  it("200: returns user object", () => {
    return request(app)
      .get(`/api/users/${username}`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(expect.objectContaining({ username }));
      });
  });
  it("404: user not found", () => {
    return request(app)
      .get(`/api/users/not-a-user`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .expect(404);
  });
  it("401: invalid token", () => {
    return request(app)
      .get(`/api/users/${username}`)
      .set(tokenHeaderKey, `Bearer INVALID.TOKEN.HERE`)
      .expect(401);
  });
});
