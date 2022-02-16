import React, { useEffect } from "react";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import {
  isCorrectAnswer,
  Question,
  Questions,
  randomQuestion,
} from "./questions";

export const QuestionContext = createContext({ randomQuestion });

interface QuestionProps {
  readonly correctAnswered: number;
  readonly questionsAnswered: number;
  setQuestionsAnswered?: Dispatch<SetStateAction<number>>;
  setCorrectAnswered?: Dispatch<SetStateAction<number>>;
}

export function FrontPage(config: QuestionProps) {
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

export function MapQuestions(config: QuestionProps) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // @ts-ignore
  // får spørsmål generert fra api kall
  useEffect(async () => {
    const response = await fetch("api/question/random");
    const questionData = await response.json();

    setQuestion(questionData);
  }, []);

  // funker ikke helt å poste svar ennå, får 404, men har med post requesten
  // i quizRouter å gjøre antageligvis
  function checkAnswer(answer: string) {
    fetch("api/question/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer: answer,
      }),
    });

    const result = isCorrectAnswer(question, answer);
    config.setQuestionsAnswered?.((q: number) => q + 1);

    if (result) {
      config.setCorrectAnswered?.((q: number) => q + 1);
      navigate("/answer/correct");
    } else {
      navigate("/answer/wrong");
    }
  }

  if (!question) return <h2>Loading...</h2>;

  return (
    <>
      <h2>{question.question}</h2>
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
