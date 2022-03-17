const app = require("../app");
const request = require("supertest");
const { toBeBetween, toBeAfter, toBeBefore } = require("jest-extended");
expect.extend({ toBeBetween, toBeAfter, toBeBefore });
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
require("dotenv").config();
const db = require("./db");
const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
let token = "NO TOKEN";
const Question = require("../models/questions.model");

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

describe("POST /api/documents/", () => {
  it("201: resource created", async () => {
    const ids = (await Question.find().limit(5)).map((question) =>
      question._id.toString()
    );
    const body = { questions: ids, author: "russ.johnson" };
    return request(app)
      .post("/api/documents/")
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send(body)
      .expect(201)
      .then(({ body }) => {
        expect(body.document).toEqual(expect.objectContaining({ ...body }));
      });
  });
});
