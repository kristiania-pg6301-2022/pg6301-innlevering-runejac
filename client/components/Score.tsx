import React from "react";
import { QuestionProps } from "../models/QuestionProps";

export function Score(props: QuestionProps) {
  return (
    <div>
      <p className={"score-txt"} data-testid={"score-status"}>
        {props.correct} / {props.answered} correct answered
      </p>
    </div>
  );
}
