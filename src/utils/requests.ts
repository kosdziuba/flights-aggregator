import axios, { AxiosResponse } from 'axios';

export enum RequestMethods {
  GET = 'get',
  POST = 'post',
}

interface RequesterInterface {
  url: string;
  method?: RequestMethods;
  data?: object;
  timeout?: number;
}

export const makeRequest = async ({
  url,
  method = RequestMethods.GET,
  data = {},
  timeout = 0,
}: RequesterInterface): Promise<AxiosResponse<any>> => {
  const requestConfig = { url, method };

  if (method === RequestMethods.POST) {
    requestConfig['data'] = data;
  }

  if (timeout) {
    requestConfig['signal'] = AbortSignal.timeout(timeout);
  }

  return axios(requestConfig);
};
