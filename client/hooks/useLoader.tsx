import { SetStateAction, useEffect, useState } from "react";
import { QuestionAnimals } from "../questions-animals";

// hook from class
export function useLoader(loadingFn: {
  (): Promise<any>;
  ():
    | SetStateAction<QuestionAnimals | undefined>
    | PromiseLike<SetStateAction<QuestionAnimals | undefined>>;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>();
  const [data, setData] = useState<QuestionAnimals | undefined | any>();
  // kan sette <QuestionAnimals> her i stedet for <any>, men setter <any> ellers får
  // jeg rød line på 156 i Quiz.tsx, for .correct finnes ikke i interfacet,
  // men når den kompilerer fanger
  // den heller data fra linje 23 i quizRouter.ts

  async function reload(): Promise<void> {
    setLoading(true);
    setData(undefined);
    setError(undefined);
    try {
      setData(await loadingFn());
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }
  // @ts-ignore
  useEffect(reload, []);

  return { loading, error, data, reload };
}
