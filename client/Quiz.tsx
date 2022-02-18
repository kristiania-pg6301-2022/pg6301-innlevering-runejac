import React, { useEffect } from "react";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
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
  Questions,
  randomQuestion,
} from "./quiestions-animals";

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
      <h1 className={"correct-or-wrong-txt"}>Take a quiz</h1>
      <h4 className={"correct-or-wrong-txt"} data-testid={"frontpage-status"}>
        {config.correctAnswered} / {config.questionsAnswered} correct answered
      </h4>
      <div>
        <Link className={"home"} to={"/question"}>
          New quiz
        </Link>
      </div>
    </div>
  );
}

export function MapQuestions(config: QuestionProps) {
  const navigate = useNavigate();
  const [questionApi, setQuestionApi] = useState<QuestionAnimals>();
  const [isLoading, setIsLoading] = useState(false);

  // får spørsmål generert fra api kall
  // GET
  const getQuestion = async () => {
    const response = await fetch("api/question/random");
    const questionData = await response.json();
    setQuestionApi(questionData);
  };

  // todo forsøker noe i test med å mocke denne funksjonen
  module.exports = {
    getQuestion,
  };
  // kaller på funksjon i useEffect, ellers fikk jeg TS error TS2345
  // GET
  useEffect(() => {
    getQuestion().catch((error) => {
      console.error("Error with fetch (GET) operation:", error);
    });
  }, []);

  function checkAnswer(answer: string, id: number) {
    // POST
    fetch("api/question/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer,
        id,
      }),
    }).catch((error) => {
      console.error(
        "There has been a problem with your fetch (POST) operation:",
        error
      );
    });
    console.log(answer, id);

    const result = isCorrectAnswer(questionApi, answer);
    config.setQuestionsAnswered?.((q: number) => q + 1);

    if (result) {
      config.setCorrectAnswered?.((q: number) => q + 1);
      navigate("/answer/correct");
    } else {
      navigate("/answer/wrong");
    }
  }

  if (!questionApi) return <h2>Loading...</h2>;

  return (
    <>
      <h2>{questionApi.question}</h2>
      <div>
        {Object.keys(questionApi.answers).map((answer: string) =>
          questionApi.answers[answer] == null ? null : (
            <div key={answer} data-testid={answer}>
              <button
                className={"button"}
                name={"answer"}
                onClick={() => checkAnswer(answer, questionApi.id)}
              >
                {questionApi.answers[answer]}
              </button>
            </div>
          )
        )}
      </div>
      <div>
        <p data-testid={"map-question-status"}>
          {config.correctAnswered} / {config.questionsAnswered} correct answered
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
    <div className={"show-answer-div"}>
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
