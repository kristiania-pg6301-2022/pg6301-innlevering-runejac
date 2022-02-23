import { createContext } from "react";
import { randomQuestion } from "../questions-animals";

export const QuestionContext = createContext({ randomQuestion });
