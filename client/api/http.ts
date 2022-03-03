export class HttpError extends Error {
  constructor(status: number, statusText: string) {
    super("Custom exception thrown: " + statusText);
    // @ts-ignore
    this.status = status;
  }
}
