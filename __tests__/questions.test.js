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
let test_oid;
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
  it("200: query with date", () => {
    const from = "2005-01",
      to = "2015-01";
    const params = new URLSearchParams();
    params.set("from", from);
    params.set("to", to);
    return request(app)
      .get(`/api/questions/?${params.toString()}`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        body.questions.forEach((question) => {
          expect(new Date(question.date)).toBeBetween(
            new Date(from),
            new Date(to)
          );
        });
        body.questions[0].date = new Date(body.questions.date);
      });
  });
  it("200: query with date (from only)", () => {
    const from = "2005-01";
    const params = new URLSearchParams();
    params.set("from", from);
    return request(app)
      .get(`/api/questions/?${params.toString()}`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        body.questions.forEach((question) => {
          expect(new Date(question.date)).toBeAfter(new Date(from));
        });
        body.questions[0].date = new Date(body.questions.date);
      });
  });
  it("200: query with date (to only)", () => {
    const to = "2015-01";
    const params = new URLSearchParams();
    params.set("to", to);
    return request(app)
      .get(`/api/questions/?${params.toString()}`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        body.questions.forEach((question) => {
          expect(new Date(question.date)).toBeBefore(new Date(to));
        });
        body.questions[0].date = new Date(body.questions.date);
      });
  });
  it("400: bad date query", () => {
    const from = "INVALID DATE",
      to = "INVALID DATE";
    const params = new URLSearchParams();
    params.set("from", from);
    params.set("to", to);
    return request(app)
      .get(`/api/questions/?${params.toString()}`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .expect(400);
  });
  it("200: search term query", () => {
    const term = "water";
    const params = new URLSearchParams();
    params.set("term", term);
    return request(app)
      .get(`/api/questions/?${params.toString()}`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        body.questions.forEach((question) => {
          expect(question.question_text).toMatch(new RegExp(term, "i"));
        });
      });
  });
  it("200: topic query", () => {
    const topic = "4.1 Magnetism";
    const params = new URLSearchParams();
    params.set("topic", topic);
    return request(app)
      .get(`/api/questions/?${params.toString()}`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        body.questions.forEach((question) => {
          expect(question.topic).toBe(topic);
        });
      });
  });
});

describe("POST /api/questions/", () => {
  it("201: returns new question object", () => {
    const newQuestion = {
      subject: "Physics",
      award: "IGCSE",
      exam_board: "CIE",
    };
    return request(app)
      .post("/api/questions/")
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send(newQuestion)
      .expect(201)
      .then(({ body }) => {
        test_oid = body.question._id;
        expect(body.question).toEqual(
          expect.objectContaining({ _id: expect.any(String), ...newQuestion })
        );
      });
  });
});

describe("PUT /api/questions/:_id", () => {
  const modifiedQuestion = {
    number: 1,
    date: "2009-05",
    topic: "1.8 dingle dangle",
    subject: "Physics",
    award: "A Level",
    exam_board: "AQA",
    tags: ["length", "short-answer"],
    question_images: ["https://3t0gmnpegmfmefdv"],
    mark_scheme_images: ["https://3t0gmnpegmfmefdv"],
    added_by: "russ.johnson",
    question_text: "What is a micrometer?",
    answer_text: "A device for measuring small things",
    description: "A question about a micrometer",
  };
  it("204: updates question object", () => {
    return request(app)
      .put(`/api/questions/${test_oid}`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send(modifiedQuestion)
      .expect(204);
  });
  it("400: invalid object id", () => {
    return request(app)
      .put(`/api/questions/INVALID_ID`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send(modifiedQuestion)
      .expect(400);
  });
  it("404: object not found", () => {
    return request(app)
      .put(`/api/questions/623323766fba124dea76071b`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send(modifiedQuestion)
      .expect(404);
  });
});

describe("DELETE /api/questions/:id", () => {
  it("200: resource deleted", () => {
    return request(app)
      .delete(`/api/questions/${test_oid}`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send()
      .expect(200)
      .then(() => {
        Question.findOne({ _id: test_oid }).then((q) => {
          expect(q).toBe(null);
        });
      });
  });
  it("400: invalid id", () => {
    return request(app)
      .delete(`/api/questions/INVALID`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send()
      .expect(400);
  });
  it("404: not found", () => {
    return request(app)
      .delete(`/api/questions/623323766fba124dea76071b`)
      .set(tokenHeaderKey, `Bearer ${token}`)
      .send()
      .expect(404);
  });
});
