import React from "react";
import { QuestionProps } from "../Quiz";

export function Score(props: QuestionProps) {
  return (
    <div>
      <p className={"score-txt"} data-testid={"score-status"}>
        {props.correct} / {props.answered} correct answered
      </p>
    </div>
  );
}
