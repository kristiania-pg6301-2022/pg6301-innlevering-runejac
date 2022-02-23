import { createContext } from "react";
import { randomQuestion } from "../quiestions-animals";

export const QuestionContext = createContext({ randomQuestion });
