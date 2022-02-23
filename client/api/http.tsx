export class HttpError extends Error {
  constructor(status: number, statusText: string) {
    super("Exception from http.tsx:" + statusText);
    // @ts-ignore
    this.status = status;
  }
}

// GET request
export async function getJSON(apiUrl: RequestInfo) {
  const res = await fetch(apiUrl);

  if (res.status === 204) {
    return null;
  } else if (res.ok) {
    return await res.json();
  } else {
    throw new HttpError(res.status, res.statusText);
  }
}

// POST request, må ha med method, headers og body
export async function postJSON(apiUrl: RequestInfo, json: RequestInit | any) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });
  // fordi jeg skal gjøre noe med svaret returnerer jeg responsen så den kan brukes
  // til å sjekke om svar er rett eller galt og kunne brukes i navigate hook-en
  return response.json();
}
