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
afterAll(async () => {
  await db.clearDatabase();
  await db.closeDatabase();
});

describe("GET /api/questions/", () => {
  it("200: returns an array of questions", () => {
    return request(app)
      .get("/api/questions")
      .set(tokenHeaderKey, `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.questions).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ subject: expect.any(String) }),
          ])
        );
      });
  });
  it("200: query with tag", () => {
    const tags = ["springs", "multi-choice"];
    const params = new URLSearchParams();
    tags.forEach((tag) => params.append("tags", tag));
    return request(app)
      .get(`/api/questions/?${params.toString()}`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.questions).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ tags: expect.arrayContaining(tags) }),
          ])
        );
      });
  });
});
