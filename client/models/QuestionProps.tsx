import HttpError from "../api/http";

export interface QuestionProps {
  error?: Error | HttpError | undefined;
  answered: number;
  correct: number;
  reloadScore?: () => void | Promise<void>;
  questionApi?: any | { questions: () => Promise<any> };
  postAnswerApi?: (
    answer: string,
    id: number
  ) => { isCorrect: boolean } | PromiseLike<{ isCorrect: boolean }>;
}
