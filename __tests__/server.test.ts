import express, { Express } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import request from "supertest";
import { QuizRouter } from "../server/quizRouter";

const app: Express = express();
app.use(bodyParser.json());
app.use(cookieParser("test secret"));
app.use("/", QuizRouter);

describe("Start testing server side", function () {
  it("should return status code 200", async function () {
    await request(app).get("/question/random").expect(200);
  });

  it("should return status code 404, wrong url", async function () {
    await request(app).get("/y89yh9dhawoioø20").expect(404);
  });

  it("should return status code 404 on incorrect question", async function () {
    await request(app).post("/question/answer").send({ id: 42 }).expect(404);
  });

  /*   it("should return status code 404, no question found", async function () {
    const response = await request(app).get("/question/random").expect(404);
    expect(response.body.question).not.toBe({
      question: "Hello There, you can't find this question in the api",
    });
    /!* expect(response.status).toBe(404); *!/
  }); */

  it("should return a random question with its properties", async function () {
    const response = await request(app).get("/question/random");
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      answers: expect.any(Object),
      category: expect.any(String),
      question: expect.any(String),
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toHaveProperty("correct_answers");
  });

  it("should respond to /question/random and check content-type", async function () {
    const response = await request(app).get("/question/random");
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual(response.text);
  });

  it("should count score", async function () {
    const agent = request.agent(app);
    await agent.post("/question/answer").send({ id: 974, answer: "answer_d" });
    await agent.post("/question/answer").send({ id: 976, answer: "answer_a" });
    await agent.get("/question/score").expect(200).expect({
      answers: 2,
      correct: 1,
    });
  });

  it("should respond to correct answer", async function () {
    await request(app)
      .post("/question/answer")
      .send({
        id: 974,
        answer: "answer_d",
      })
      .expect({ isCorrect: true });
  });

  it("should respond to wrong answer", async function () {
    await request(app)
      .post("/question/answer")
      .send({
        id: 974,
        answer: "answer_b",
      })
      .expect({ isCorrect: false });
  });
});
