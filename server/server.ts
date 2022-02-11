import express from "express";
import {
  isCorrectAnswer,
  Questions,
  randomQuestion,
} from "../client/questions";
import { AddressInfo } from "net";

export const QuizApp = express.Router();
const app = express();
app.use("/question", QuizApp);

/* const server = app.listen(process.env.PORT || 3000, function () {
  console.log(
    `starting server on http://localhost:${
      (server.address() as AddressInfo).port
    }`
  );
}); */

QuizApp.get("/random", function (req, res, next) {
  const { id, category, answers, question } = randomQuestion();
  res.send({ id, category, question, answers });
});
