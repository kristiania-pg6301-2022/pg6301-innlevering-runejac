import { SetStateAction, useEffect, useState } from "react";
import { QuestionAnimals } from "../quiestions-animals";

// hook from class
export function useLoader(loadingFn: {
  (): Promise<any>;
  ():
    | SetStateAction<QuestionAnimals | undefined>
    | PromiseLike<SetStateAction<QuestionAnimals | undefined>>;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState<QuestionAnimals>();
  // @ts-ignore
  useEffect(reload, []);

  async function reload() {
    setLoading(true);
    setData(undefined);
    setError(undefined);
    try {
      setData(await loadingFn());
    } catch (error) {
      // @ts-ignore
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, data, reload };
}
