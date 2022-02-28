import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useLoader } from "./hooks/useLoader";
import { FrontPage } from "./components/FrontPage";
import { ShowAnswer } from "./components/ShowAnswer";
import { getApis } from "./api/getApis";
import { Home } from "./components/Home";
import { Score } from "./components/Score";

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

export function MapQuestions(props: QuestionProps) {
  const navigate = useNavigate();
  const {
    loading,
    error,
    data: question,
    reload: reloadQuestions,
  } = useLoader(props.questionApi);

  async function answerHandler(answer: string, id: number) {
    const answerSent: { isCorrect: boolean } = await props.postAnswerApi!(
      answer,
      id
    );

    props.reloadScore!();
    // for å refreshe "score" så brukes reload fra /api/question/score- kallet
    if (answerSent.isCorrect) {
      navigate("/answer/correct");
    } else {
      navigate("/answer/wrong");
    }
  }

  if (error) {
    return (
      <div className={"error-message"}>
        An error occurred: {error.toString()}
      </div>
    );
  }

  if (!question || loading) return <h2>Loading...</h2>;

  return (
    <>
      <div>
        <p className={"question-and-score-txt"}>{question.question}</p>
        {Object.keys(question.answers).map((answer: string) =>
          question?.answers[answer] == null ? null : (
            <div key={answer} data-testid={answer}>
              <button
                className={"button"}
                name={"answer"}
                onClick={() => answerHandler(answer, question.id)}
              >
                {question.answers[answer]}
              </button>
            </div>
          )
        )}
      </div>
      <Score correct={props.correct} answered={props.answered} />
      <Home />
    </>
  );
}

function Quiz() {
  const { data: score, reload: reloadScore } = useLoader(getApis.scoreApi);

  // måtte ha ? her fordi jeg fikk
  // "TypeError: Cannot read properties of undefined (reading 'correct')"
  const correct: number = Number(score?.correct);
  const answered: number = Number(score?.answers);

  return (
    <Routes>
      <Route
        path={"/"}
        element={<FrontPage correct={correct} answered={answered} />}
      />
      <Route
        path={"/question"}
        element={
          <MapQuestions
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
