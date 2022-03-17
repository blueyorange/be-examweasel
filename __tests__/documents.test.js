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
const Document = require("../models/documents.model");
let testDocId = "NO ID";

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
    const doc = { author: "russ.johnson" };
    return request(app)
      .post("/api/documents/")
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send(doc)
      .expect(201)
      .then(({ body }) => {
        testDocId = body.document._id;
        expect(body.document).toEqual(
          expect.objectContaining({ _id: expect.any(String), ...doc })
        );
      });
  });
});

describe("PUT /api/documents/:_id", () => {
  let testQuestionIds;
  it("204: updates document", async () => {
    testQuestionIds = (await Question.find().limit(5)).map((question) =>
      question._id.toString()
    );
    const modifiedDocument = {
      question_ids: testQuestionIds,
    };
    return request(app)
      .put(`/api/documents/${testDocId}`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send(modifiedDocument)
      .expect(204);
  });
  it("400: invalid object id", () => {
    return request(app)
      .put(`/api/documents/INVALID_ID`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send({})
      .expect(400);
  });
  it("404: object not found", () => {
    return request(app)
      .put(`/api/documents/623323766fba124dea76071b`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send({})
      .expect(404);
  });
});

describe("DELETE /api/documents/:id", () => {
  it("200: resource deleted", () => {
    return request(app)
      .delete(`/api/documents/${testDocId}`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send()
      .expect(200)
      .then(() => {
        Document.findOne({ _id: testDocId }).then((doc) => {
          expect(doc).toBe(null);
        });
      });
  });
  it("400: invalid id", () => {
    return request(app)
      .delete(`/api/documents/INVALID`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send()
      .expect(400);
  });
  it("404: not found", () => {
    return request(app)
      .delete(`/api/documents/623323766fba124dea76071b`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send()
      .expect(404);
  });
});
