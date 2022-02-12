import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import request from "supertest";
import { QuizApp } from "../server";

const app = express();
app.use(bodyParser.json());
app.use(cookieParser("test secret"));
app.use("/question", QuizApp);

describe("Start testing quiz server", function () {
  it("should return 200 ok", async function () {
    const response = await request(app).get("/question/random").expect(200);
    expect(response.status).toEqual(200);
  });
});
