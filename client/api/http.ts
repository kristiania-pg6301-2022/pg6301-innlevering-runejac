export class HttpError extends Error {
  constructor(status: number, statusText: string) {
    super("Exception from http.tsx:" + statusText);
    // @ts-ignore
    this.status = status;
  }
}
