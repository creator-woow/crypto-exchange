export interface IRawHTTPError {
  error?: string;
  message?: string;
}

export class HTTPError extends Error {
  id?: string;

  constructor(error: IRawHTTPError) {
    super(error.message);
    this.id = error.error;
  }
}