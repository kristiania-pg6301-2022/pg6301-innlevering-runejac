import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useLoader } from "./hooks/useLoader";
import { FrontPage } from "./components/FrontPage";
import { Score } from "./components/Score";
import { ShowAnswer } from "./components/ShowAnswer";
import { postJSON } from "./api/apiHandler";
import { getApis } from "./api/getApis";

export interface QuestionProps {
  answered: number | any;
  correct: number | any;
  reloadScore?: any;
  questionApi?: any | { questions: () => Promise<any> } | Promise<any>;
  postAnswer?: any;
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
    const isCorrect = await props.postAnswer(answer, id);
    props.reloadScore();
    // for å refreshe "score" så brukes reload fra /api/question/score- kallet
    if (isCorrect) {
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
      <h2>{question.question}</h2>
      <div>
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
      <Score
        correct={props.correct}
        answered={props.answered}
        reloadScore={props.reloadScore}
      />
    </>
  );
}

function Quiz() {
  const {
    loading,
    error,
    data: score,
    reload: reloadScore,
  } = useLoader(getApis.scoreApi);

  // måtte ha ? her fordi jeg fikk
  // "TypeError: Cannot read properties of undefined (reading 'correct')"
  const correct = Number(score?.correct);
  const answered = Number(score?.answers);

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
            postAnswer={getApis.postAnswer}
          />
        }
      />
      <Route path={"/answer/*"} element={<ShowAnswer />} />
      <Route path={"*"} element={<h1>Not found</h1>} />
    </Routes>
  );
}

export default Quiz;
