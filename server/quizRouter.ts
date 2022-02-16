import express from "express";
import { Questions, randomQuestion } from "../client/questions";

export const QuizRouter = express.Router();

QuizRouter.get(
  "/question/random",
  (req: express.Request, res: express.Response) => {
    const question = randomQuestion();

    res.json(question);
  }
);

/*QuizRouter.post("/question/answer", function (req, res, _next) {
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
});*/

QuizRouter.post("/question/answer", (req, res) => {
  const question = Questions.find((q) => q.id === parseInt(req.body.id));

  if (!question) return res.status(404).send("POST REQ NOT FOUND");

  let isCorrect = false;
  const correctValue = req.body.answer + "_correct";

  for (const correctQuestion in question.correct_answers) {
    if (
      correctQuestion === correctValue &&
      question.correct_answers[correctQuestion] === "true"
    ) {
      isCorrect = true;
    }
  }

  res.json({
    isCorrect: isCorrect,
  });
});
