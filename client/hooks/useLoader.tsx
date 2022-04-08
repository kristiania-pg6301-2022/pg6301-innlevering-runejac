import { SetStateAction, useEffect, useState } from "react";
import { QuestionAnimals } from "../questions-animals";

export function useLoader(loadingFn: {
  (): Promise<QuestionAnimals>;
  ():
    | SetStateAction<QuestionAnimals>
    | PromiseLike<SetStateAction<QuestionAnimals>>;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>();
  const [data, setData] = useState<QuestionAnimals | undefined | any>();
  // kan sette <QuestionAnimals> kun her i stedet for <any>, men setter <any> i tillegg
  // ellers får jeg ts feil på 23 i Quiz.tsx, for .correct finnes ikke i interfacet
  // QuestionAnimals, men når den kompilerer fanger
  // den heller data fra linje 19 i quizApi.ts

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

  useEffect(() => {
    (async () => {
      await reload();
    })();
  }, [loadingFn]);

  return { loading, error, data, reload };
}
