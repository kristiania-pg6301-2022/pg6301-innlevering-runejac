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

  function checkAnswer(answer: string, id: number) {
    // POST
    postAnswerHTTP(answer, id);
    /* console.log(answer, id); */

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
                onClick={() => checkAnswer(answer, question.id)}
              >
                {question.answers[answer]}
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
            Home
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
