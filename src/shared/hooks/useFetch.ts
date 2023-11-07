import { Reducer, useEffect, useMemo, useReducer } from 'react';
import { HTTP, IRequestConfig } from 'shared/lib/http';

export enum FetchStatus {
  Pending = 'PENDING',
  Error = 'ERROR',
  Success = 'SUCCESS',
  None = 'NONE',
  Default = None
}

enum FetchAction {
  Load = 'LOAD',
  Success = 'SUCCESS',
  Error = 'ERROR'
}

interface ILoadAction {
  type: FetchAction.Load;
}

interface ISuccessAction<TResult> {
  type: FetchAction.Success;
  upload: TResult;
}

interface IErrorAction {
  type: FetchAction.Error;
  upload: Error;
}

interface IFetchState<TData> {
  status: FetchStatus;
  isPending: boolean;
  error?: Error;
  data?: TData;
}

type TFetchAction<TData> = ILoadAction | ISuccessAction<TData> | IErrorAction;
type TFetchReducer<TData> = Reducer<IFetchState<TData>, TFetchAction<TData>>

interface IUseFetchConfig {
  queries?: Record<string, unknown>;
  headers?: IRequestConfig['headers'];
  // For cases when we don't need to repeat request each url change
  preventRequest?: boolean;
}

function constructURLQuery(queriesObj: Record<string, unknown> = {}) {
  return Object.entries(queriesObj).reduce((result, [key, value], index) => {
    if (index === 0) {
      return `${key}=${value}`
    }
    return `${result}&${key}=${value}`
  }, '')
}

function stateReducer<TData> (
  state: IFetchState<TData>,
  action: TFetchAction<TData>
): IFetchState<TData> {
  switch(action.type) {
    case FetchAction.Load:
      return { ...state, status: FetchStatus.Pending, isPending: true }
    case FetchAction.Success:
      return { ...state, status: FetchStatus.Success, data: action.upload, isPending: false }
    case FetchAction.Error:
      return { ...state, status: FetchStatus.Error, error: action.upload, isPending: false }
    default:
      return state
  }
}

export const useFetch = <TResult>(url: string, config?: IUseFetchConfig): IFetchState<TResult> => {
  const { queries, headers, preventRequest } = config || {};
  const [state, dispatch] = useReducer<TFetchReducer<TResult>>(
    stateReducer,
    { status: FetchStatus.Default, isPending: false }
  );
  const urlResult = useMemo(() => `${url}?${constructURLQuery(queries)}`, [queries, url])

  useEffect(() => {
    if (preventRequest) {
      return;
    }
    dispatch({ type: FetchAction.Load });
    const controller = new AbortController();
    HTTP.get<TResult>(urlResult, { signal: controller.signal, headers  })
      .then((data) => {
        if (!controller.signal.aborted) {
          dispatch({ type: FetchAction.Success, upload: data })
        }
      })
      .catch((error) => dispatch({ type: FetchAction.Error, upload: error }))
    return () => controller.abort();
  }, [preventRequest, urlResult]);

 return state;
}
