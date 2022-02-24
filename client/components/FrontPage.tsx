import { Link } from "react-router-dom";
import React from "react";
import { QuestionProps } from "../Quiz";

export function FrontPage(props: QuestionProps) {
  return (
    <div>
      <h1 className={"correct-or-wrong-txt"}>Take a quiz</h1>
      <h4
        className={"correct-or-wrong-txt"}
        data-testid={"frontpage-score-status"}
      >
        {props.correct} / {props.answered} correct answered{" "}
      </h4>
      <div>
        <Link className={"home"} to={"/question"}>
          New quiz
        </Link>
      </div>
    </div>
  );
}
