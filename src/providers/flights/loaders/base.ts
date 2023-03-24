import { ConfigService } from '@nestjs/config';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { camelizeKeys } from 'fast-case';

import { ParsedFlightType } from '@providers/flights/loaders/types';

import { makeRequest } from '@utils/requests';

export class BaseFlightsProviderLoader {
  constructor(protected readonly url: string, protected readonly configService: ConfigService) {
    this.url = url;
    this.configService = configService;
  }

  protected parseResponseData(responseData: object): ParsedFlightType[] {
    return responseData as ParsedFlightType[];
  }

  async load(): Promise<ParsedFlightType[]> {
    const response = await makeRequest({ url: this.url, retries: 3 }).catch(
      () => ({ status: HttpStatusCode.InternalServerError, data: {}, headers: {} } as AxiosResponse),
    );
    // if request failed or reached timeout - return empty data
    if (response.status !== HttpStatusCode.Ok) {
      return [];
    }
    // processing/parsing provider data
    const responseData = camelizeKeys(response.data);
    return this.parseResponseData(responseData);
  }
}
