import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
/* import {
  isCorrectAnswer,
  Question,
  Questions,
  randomQuestion,
} from "./questions"; */
import {
  isCorrectAnswer,
  QuestionAnimals,
  randomQuestion,
} from "./quiestions-animals";
import { fetchJSON, postAnswerHTTP } from "./api/http";
import { useLoader } from "./hooks/useLoader";

export const QuestionContext = createContext({ randomQuestion });

interface ScoreProps {
  answered: number;
  correct: number;
  reload?: any;
}

export function FrontPage(props: ScoreProps) {
  return (
    <div>
      <h1 className={"correct-or-wrong-txt"}>Take a quiz</h1>
      <h4
        className={"correct-or-wrong-txt"}
        data-testid={"frontpage-score-status"}
      >
        {props.correct} / {props.answered} correct answered
      </h4>
      <div>
        <Link className={"home"} to={"/question"}>
          New quiz
        </Link>
      </div>
    </div>
  );
}

export function Score(props: ScoreProps) {
  return (
    <div>
      <p data-testid={"score-status"}>
        {props.correct} / {props.answered} correct answered
      </p>
      <p>
        <Link className={"home"} to={"/"}>
          Home
        </Link>
      </p>
    </div>
  );
}

export function MapQuestions(props: ScoreProps) {
  const navigate = useNavigate();
  const { loading, error, data, reload } = useLoader(
    async () => await fetchJSON("/api/question/random")
  );
  const question: QuestionAnimals | undefined = data;

  if (error) {
    return (
      <div className={"error-message"}>
        An error occurred: {error.toString()}
      </div>
    );
  }

  function answerHandler(answer: string, id: number) {
    // POST
    postAnswerHTTP(answer, id).then((answerSent) => {
      props.reload();
      // for å refreshe "score" så brukes reload fra /api/question/score- kallet
      if (answerSent.isCorrect) {
        navigate("/answer/correct");
      } else {
        navigate("/answer/wrong");
      }
    });
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
        reload={props.reload}
      />
    </>
  );
}

export const ShowAnswer = () => {
  return (
    <div className={"show-answer-div"}>
      <Routes>
        <Route
          path={"correct"}
          element={<h1 className={"correct-or-wrong-txt"}>✅ Correct!</h1>}
        />
        <Route
          path={"wrong"}
          element={<h1 className={"correct-or-wrong-txt"}>❌ Wrong</h1>}
        />
      </Routes>
      <ul className={"ul"}>
        <li>
          <Link className={"home"} to={"/question"}>
            More questions
          </Link>
        </li>
        <li>
          <Link className={"home"} to={"/"}>
            Home
          </Link>
        </li>
      </ul>
    </div>
  );
};

const Quiz = () => {
  const { loading, error, data, reload } = useLoader(
    async () => await fetchJSON("/api/question/score")
  );

  // måtte ha ? her fordi jeg fikk
  // "TypeError: Cannot read properties of undefined (reading 'correct')"
  const correct = Number(data?.correct);
  const answered = Number(data?.answers);

  return (
    <Routes>
      <Route
        path={"/"}
        element={<FrontPage correct={correct} answered={answered} />}
      />
      <Route
        path={"/question"}
        element={
          <MapQuestions correct={correct} answered={answered} reload={reload} />
        }
      />
      <Route path={"/answer/*"} element={<ShowAnswer />} />
      <Route path={"*"} element={<h1>Not found</h1>} />
    </Routes>
  );
};

export default Quiz;
