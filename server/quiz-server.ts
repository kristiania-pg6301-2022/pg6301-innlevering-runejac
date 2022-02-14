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

QuizApp.get(
  "/random",
  function (_req: express.Request, res: express.Response, _next: NextFunction) {
    const { id, category, answers, question }: Question = randomQuestion();

    res.send({ id, category, question, answers });
  }
);
