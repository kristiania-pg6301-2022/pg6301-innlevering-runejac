import React from "react";
import { Route, Routes } from "react-router-dom";
import { useLoader } from "./hooks/useLoader";
import { getApis } from "./api/getApis";
import { FrontPage } from "./components/pages/FrontPage";
import { ShowAnswer } from "./components/pages/ShowAnswer";
import { QuestionAndAnswers } from "./components/QuestionAndAnswers";

export interface QuestionProps {
  answered: number;
  correct: number;
  reloadScore?: () => void | Promise<void>;
  questionApi?: any | { questions: () => Promise<any> };
  postAnswerApi?: (
    answer: string,
    id: number
  ) => { isCorrect: boolean } | PromiseLike<{ isCorrect: boolean }>;
}

function Quiz() {
  const { data: score, reload: reloadScore } = useLoader(getApis.scoreApi);

  const correct: number = score?.correct;
  const answered: number = score?.answers;

  return (
    <Routes>
      <Route
        path={"/"}
        element={<FrontPage correct={correct} answered={answered} />}
      />
      <Route
        path={"/question"}
        element={
          <QuestionAndAnswers
            correct={correct}
            answered={answered}
            reloadScore={reloadScore}
            questionApi={getApis.questionApi}
            postAnswerApi={getApis.postAnswerApi}
          />
        }
      />
      <Route path={"/answer/*"} element={<ShowAnswer />} />
      <Route path={"*"} element={<h1>Not found</h1>} />
    </Routes>
  );
}

export default Quiz;
