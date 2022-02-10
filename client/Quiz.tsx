import React from "react";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { isCorrectAnswer, randomQuestion } from "./questions";

export const QuestionContext = createContext({ randomQuestion });

interface IQuestionProps {
  readonly correctAnswered: number;
  readonly questionsAnswered: number;
  setQuestionsAnswered?: Dispatch<SetStateAction<number>>;
  setCorrectAnswered?: Dispatch<SetStateAction<number>>;
}

export function FrontPage(config: IQuestionProps) {
  return (
    <div>
      <h1 className={"correct-or-wrong-txt"}>Ta en quiz</h1>
      <h4 className={"correct-or-wrong-txt"} data-testid={"frontpage-status"}>
        {config.correctAnswered} / {config.questionsAnswered} rette
      </h4>

      <div>
        <Link className={"home"} to={"/question"}>
          Ny quiz
        </Link>
      </div>
    </div>
  );
}

export function MapQuestions(config: IQuestionProps) {
  const navigate = useNavigate();
  const { randomQuestion } = useContext(QuestionContext);
  const [question] = useState(randomQuestion());

  function checkAnswer(answer: string) {
    config.setQuestionsAnswered?.((q: number) => q + 1);
    if (isCorrectAnswer(question, answer)) {
      config.setCorrectAnswered?.((q: number) => q + 1);
      navigate("/answer/correct");
    } else {
      navigate("/answer/wrong");
    }
  }

  return (
    <>
      <h2>{question.question}</h2>
      <h4>Category: {question.category}</h4>
      <div>
        {Object.keys(question.answers).map((answer: string) =>
          question.answers[answer] == null ? null : (
            <div key={answer} data-testid={answer}>
              <button
                className={"button"}
                name={"answer"}
                onClick={() => checkAnswer(answer)}
              >
                {question.answers[answer]}
              </button>
            </div>
          )
        )}
      </div>
      <div>
        <p data-testid={"map-question-status"}>
          {config.correctAnswered} / {config.questionsAnswered} rette
        </p>
        <p>
          <Link className={"home"} to={"/"}>
            Hjem
          </Link>
        </p>
      </div>
    </>
  );
}

export const ShowAnswer = () => {
  return (
    <>
      <Routes>
        <Route
          path={"correct"}
          element={<h1 className={"correct-or-wrong-txt"}>Rett ✅</h1>}
        />
        <Route
          path={"wrong"}
          element={<h1 className={"correct-or-wrong-txt"}>Feil ❌</h1>}
        />
      </Routes>
      <ul className={"ul"}>
        <li>
          <Link className={"home"} to={"/question"}>
            Flere spørsmål
          </Link>
        </li>
        <li>
          <Link className={"home"} to={"/"}>
            Hjem
          </Link>
        </li>
      </ul>
    </>
  );
};

const Quiz = () => {
  const [questionAnswered, setQuestionAnswered] = useState(0);
  const [correctAnswered, setCorrectAnswered] = useState(0);

  return (
    <Routes>
      <Route
        path={"/"}
        element={
          <FrontPage
            questionsAnswered={questionAnswered}
            correctAnswered={correctAnswered}
          />
        }
      />
      <Route
        path={"/question"}
        element={
          <MapQuestions
            setQuestionsAnswered={setQuestionAnswered}
            setCorrectAnswered={setCorrectAnswered}
            questionsAnswered={questionAnswered}
            correctAnswered={correctAnswered}
          />
        }
      />
      <Route path={"/answer/*"} element={<ShowAnswer />} />
      <Route path={"*"} element={<h1>Not found</h1>} />
    </Routes>
  );
};

export default Quiz;
