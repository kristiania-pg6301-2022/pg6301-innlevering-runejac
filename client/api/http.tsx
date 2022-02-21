export class HttpError extends Error {
  constructor(status: number, statusText: string) {
    super("Exception from http.tsx:" + statusText);
    // @ts-ignore
    this.status = status;
  }
}

// only for GET requests so far (I think)
export async function fetchJSON(url: RequestInfo) {
  const res = await fetch(url);

  if (res.status === 204) {
    return null;
  } else if (res.ok) {
    return await res.json();
  } else {
    throw new HttpError(res.status, res.statusText);
  }
}

// POST request
export function postAnswerHTTP(answer: string, id: number) {
  // todo forsøker noe i test med å mocke denne funksjonen
  fetch("api/question/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      answer,
      id,
    }),
  }).catch((error) => {
    console.error(
      "There has been a problem with your fetch (POST) operation, coming from http.tsx:",
      error
    );
  });
}

exports.fetchJSON = fetchJSON;
