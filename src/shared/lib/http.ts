import { IRawHTTPError } from './httpError';

enum HTTPMethod {
  Post = 'POST',
  Get = 'GET',
  Delete = 'DELETE',
  Update = 'UPDATE',
  Put = 'PUT'
}

type TUpload = FormData | string;

export interface IRequestConfig { 
  signal?: AbortSignal;
  method?: HTTPMethod;
  upload?: TUpload;
  headers?: HeadersInit;
}

/**
 * Http client for common entry point in http requestes
 */
export class HTTP {
  static post<TResponse = object>
  (
    url: string,
    upload: TUpload
  ) {
    return this._createRequest<TResponse>(url, {
      method: HTTPMethod.Post,
      upload
    });
  }

  static get<TResponse>(url: string, config?: IRequestConfig) {
    return this._createRequest<TResponse>(url, config);
  }

  private static _createRequest<TResult>
  (
    url: string,
    config?: IRequestConfig
  ): Promise<TResult | IRawHTTPError> {
    return (
      fetch(url, {
        method: config?.method,
        body: config?.upload,
        signal: config?.signal,
        headers: config?.headers
      })
        .then((response) => response.json())
        .then((data: TResult) => data)
        .catch((error) => {
          throw error;
        })
    )
  }
}
