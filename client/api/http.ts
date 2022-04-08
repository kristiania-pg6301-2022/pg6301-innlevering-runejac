class HttpError extends Error {
  statusCode: number;
  statusText: string;

  constructor(statusCode: number, statusText: string) {
    super("Custom exception thrown: " + statusText);
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}

export default HttpError;
