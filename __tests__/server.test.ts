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

  it("should respond to /helloworld and check content-type", async function () {
    const response = await request(app).get("/helloworld");
    expect(response.header["content-type"]).toBe("text/html; charset=utf-8");
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual("Hello world");
  });

  it("should respond to correct answers", async function () {
    // todo snakker ikke med Quiz application.http??? wtf
    await request(app)
      .post("/question/answer")
      .send({
        id: 974,
        answer: "answer_d",
      })
      .expect({ isCorrect: true });
  });

  //TODO lag test for score
});
