import { useNavigate } from "react-router-dom";
import { useLoader } from "../hooks/useLoader";
import { Score } from "./Score";
import { Home } from "./pages/Home";
import React from "react";
import { QuestionProps } from "../Quiz";

export function QuestionAndAnswers(props: QuestionProps) {
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
