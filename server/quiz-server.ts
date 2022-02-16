/*
import express, { Express, NextFunction, Router } from "express";
import {
  isCorrectAnswer,
  Question,
  Questions,
  randomQuestion,
} from "../client/questions";

export const QuizApp: Router = express.Router();
const app: Express = express();
app.use("/question", QuizApp);

QuizApp.post("/answer", function (req, res, _next) {
  const { id, answer } = req.body;
  const question = Questions.find((q) => q.id === id);

  if (!question) {
    return res.sendStatus(404);
  }

  const score = req.signedCookies.score
    ? JSON.parse(req.signedCookies.score)
    : { answers: 0, correct: 0 };

  score.answers += 1;

  if (isCorrectAnswer(question, answer)) {
    score.correct += 1;
    res.cookie("score", JSON.stringify(score), { signed: true });
    res.json({ result: "correct" });
  } else {
    res.cookie("score", JSON.stringify(score), { signed: true });
    res.json({ result: "incorrect" });
  }
});

QuizApp.get(
  "/random",
  function (_req: express.Request, res: express.Response, _next: NextFunction) {
    const { id, category, answers, question }: Question = randomQuestion();

    res.send({ id, category, question, answers });
  }
);

// only for test purposes
QuizApp.get(
  "/helloworld",
  function (_req: express.Request, res: express.Response, _next: NextFunction) {
    res.send("Hello world");
  }
);
*/
