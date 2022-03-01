import { Link } from "react-router-dom";
import React from "react";
import { QuestionProps } from "../../Quiz";
import { Score } from "../Score";

export function FrontPage(props: QuestionProps) {
  return (
    <div>
      <h1 className={"question-and-score-txt"}>Take a quiz</h1>
      <Score correct={props.correct} answered={props.answered} />
      <div>
        <Link className={"home"} to={"/question"}>
          New quiz
        </Link>
      </div>
    </div>
  );
}
