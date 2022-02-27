import { getJSON, postJSON } from "./apiHandler";

export const getApis = {
  questionApi: async () => await getJSON("/api/question/random"),
  scoreApi: async () => await getJSON("/api/question/score"),

  postAnswerApi: async (answer: string, id: number) => {
    return postJSON("/api/question/answer", {
      answer,
      id,
    });
  },
};
