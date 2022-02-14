import express, { Express } from "express";
import { AddressInfo } from "net";
import { QuizApp } from "./quiz-server";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

dotenv.config();
const app: Express = express();
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/question", QuizApp);

const server = app.listen(process.env.PORT || 3000, function () {
  console.log(
    `Starting server on http://localhost:${
      (server.address() as AddressInfo).port
    }`
  );
});
