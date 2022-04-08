import React from "react";
import { QuestionProps } from "../models/QuestionProps";

export function Score(props: QuestionProps) {
  return (
    <div className={"score-wrapper"} data-testid={"score-status"}>
      <p className={"score-txt-correct"}>{props.correct}</p>
      <p className={"score-text-separator"}> / </p>
      <p className={"score-txt-answered"}>{props.answered}</p>
    </div>
  );
}
