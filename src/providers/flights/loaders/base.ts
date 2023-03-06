/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { Cache } from 'cache-manager';
import { camelizeKeys } from 'fast-case';

import { DEFAULT_RESOURCE_TTL } from '@providers/flights/loaders/constants';
import { BaseCachedFlightsType, ParsedFlightType } from '@providers/flights/loaders/types';

import { makeRequest } from '@utils/requests';
import { HashTable } from '@utils/types';

export class BaseFlightsProviderLoader {
  constructor(protected readonly cacheManager: Cache, protected readonly configService: ConfigService) {
    this.cacheManager = cacheManager;
    this.configService = configService;
  }

  protected parseResponseData(responseData: object): HashTable<ParsedFlightType> {
    return responseData as HashTable<ParsedFlightType>;
  }

  async load(url: string, resourceTtl = DEFAULT_RESOURCE_TTL): Promise<HashTable<ParsedFlightType>> {
    const cacheKey = `flights-${url}`;
    const cachedData: BaseCachedFlightsType = (await this.cacheManager.get(cacheKey)) || {};

    const response = await makeRequest({ url, timeout: this.configService.get('loadersTimeout') }).catch(
      () => ({ status: HttpStatusCode.InternalServerError, data: {}, headers: {} } as AxiosResponse),
    );
    debugger;
    if (response.status !== HttpStatusCode.Ok) {
      return cachedData['data'] || {};
    }

    if (this.mayApplyCache(response, cachedData)) {
      return cachedData['data'];
    }

    const responseData = camelizeKeys(response.data);
    const result = this.parseResponseData(responseData);
    await this.setCache(cacheKey, result, response, resourceTtl);
    return result;
  }

  protected async setCache(
    cacheKey: string,
    data: HashTable<ParsedFlightType>,
    response: AxiosResponse<any>,
    resourceTtl = DEFAULT_RESOURCE_TTL,
  ): Promise<void> {
    await this.cacheManager.set(cacheKey, { data }, resourceTtl);
  }

  protected mayApplyCache(response: AxiosResponse<any>, cachedData: BaseCachedFlightsType): boolean {
    return false;
  }
}
