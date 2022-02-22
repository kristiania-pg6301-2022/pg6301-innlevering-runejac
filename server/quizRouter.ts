import express from "express";
// todo husk å endre dette til rett avhengig av hvilken api du bruker
/* import { Questions randomQuestion } from "../client/questions"; */
import {
  isCorrectAnswer,
  QuestionAnimals,
  Questions,
  randomQuestion,
} from "../client/quiestions-animals";

export const QuizRouter = express.Router();

QuizRouter.get(
  "/question/score",
  (req: express.Request, res: express.Response) => {
    const score = req.signedCookies.score
      ? JSON.parse(req.signedCookies.score)
      : { answers: 0, correct: 0 };

    // kan skrive bare "score" her og
    res.send({
      answers: score.answers,
      correct: score.correct,
    });
  }
);

QuizRouter.get(
  "/question/random",
  (
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    //todo prøv her å få til at man ikke skal trenge å ha med correct_answers
    const { question, id, answers, category } = randomQuestion();

    if (!question) {
      res.status(404).send("GET request not found from quizRouter.ts line 22");
    }
    res.json({ question, id, answers, category });
  }
);

QuizRouter.post(
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
