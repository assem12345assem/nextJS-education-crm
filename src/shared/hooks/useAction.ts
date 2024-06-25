import { AxiosError, AxiosPromise, AxiosResponse } from "axios";

export interface OptionsType<T> {
  show?: boolean;
  successCallback?: (response: AxiosResponse<T>) => void;
  errorCallback?: (error: AxiosError<T>) => void;
}

export const useAction = async <T>(
  promiseFunction: AxiosPromise<T>,
  options: OptionsType<T>
): Promise<AxiosResponse<T>> => {
  const { show, successCallback, errorCallback } = options;

  const response = await promiseFunction;
  if (response && successCallback) {
    successCallback(response);
  }

  if (!response && errorCallback) {
    errorCallback(response);
  }

  return response;
};
