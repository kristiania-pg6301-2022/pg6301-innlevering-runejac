export class HttpError extends Error {
  constructor(status: number, statusText: string) {
    super("Exception from http.ts:" + statusText);
    // @ts-ignore
    this.status = status;
  }
}
