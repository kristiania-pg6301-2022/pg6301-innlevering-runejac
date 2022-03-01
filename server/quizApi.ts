import express, { NextFunction } from "express";
import {
  isCorrectAnswer,
  Questions,
  randomQuestion,
} from "../client/questions-animals";

export const quizApi = express.Router();

quizApi.get(
  "/question/score",
  (req: express.Request, res: express.Response) => {
    const score = req.signedCookies.score
      ? JSON.parse(req.signedCookies.score)
      : { answers: 0, correct: 0 };

    res.send({
      answers: score.answers,
      correct: score.correct,
    });
  }
);

quizApi.get(
  "/question/random",
  (
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const { question, id, answers, category } = randomQuestion();

    if (!question) {
      res.status(404).send("GET request not found");
    }
    res.json({ question, id, answers, category });
  }
);

quizApi.post(
  "/question/answer",
  (
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const { id, answer } = req.body;
    const question = Questions.find((q) => q.id === id);

    if (!question) return res.status(404).send("POST request not found");

    let isCorrect = false;

    const score = req.signedCookies.score
      ? JSON.parse(req.signedCookies.score)
      : { answers: 0, correct: 0 };

    score.answers += 1;

    if (isCorrectAnswer(question, answer)) {
      isCorrect = true;
      score.correct += 1;
      res.cookie("score", JSON.stringify(score), { signed: true });
    } else {
      res.cookie("score", JSON.stringify(score), { signed: true });
    }

    res.json({
      isCorrect,
    });
  }
);

quizApi.get(
  "/*",
  function (_req: express.Request, res: express.Response, _next: NextFunction) {
    res.status(404).send("No question found");
  }
);
