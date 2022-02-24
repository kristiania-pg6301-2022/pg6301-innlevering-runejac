import { Link } from "react-router-dom";
import React from "react";
import { QuestionProps } from "../Quiz";

export function Score(props: QuestionProps) {
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
