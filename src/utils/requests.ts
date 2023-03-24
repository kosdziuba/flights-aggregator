import axios, { AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';

export enum RequestMethods {
  GET = 'get',
  POST = 'post',
}

interface RequesterInterface {
  url: string;
  method?: RequestMethods;
  data?: object;
  timeout?: number;
  retries?: number;
}

// timeout also includes the time required to establish connection
export const makeRequest = async ({
  url,
  method = RequestMethods.GET,
  data = {},
  timeout = 0,
  retries = 0,
}: RequesterInterface): Promise<AxiosResponse<any>> => {
  const requestConfig = { url, method };

  if (method === RequestMethods.POST) {
    requestConfig['data'] = data;
  }

  if (timeout) {
    requestConfig['signal'] = AbortSignal.timeout(timeout);
  }

  const client = axios.create(requestConfig);
  if (retries) axiosRetry(client, { retries: retries, retryDelay: axiosRetry.exponentialDelay });

  return client.request(requestConfig);
};
