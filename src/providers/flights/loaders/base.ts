/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, HttpStatusCode } from 'axios';
import { Cache } from 'cache-manager';
import { camelizeKeys } from 'fast-case';

import { DEFAULT_RESOURCE_TTL } from '@providers/flights/loaders/constants';
import { BaseCachedFlightsType, ParsedFlightType } from '@providers/flights/loaders/types';

import { makeRequest } from '@utils/requests';
import { dateTransformer, HashTable } from '@utils/types';

export class BaseFlightsProviderLoader {
  constructor(protected readonly cacheManager: Cache, protected readonly configService: ConfigService) {
    this.cacheManager = cacheManager;
    this.configService = configService;
  }

  protected parseResponseData(responseData: object): HashTable<ParsedFlightType> {
    return responseData as HashTable<ParsedFlightType>;
  }

  protected async getCache(cacheKey: string): Promise<object> {
    // TODO: I don't know how to overcome this issue. Will come later with a fix
    // @ts-ignore
    const cachedData: string | object = await this.cacheManager.store.get(cacheKey, { parse: false });
    return typeof cachedData === 'string' ? dateTransformer(cachedData) : cachedData;
  }

  async load(url: string, resourceTtl = DEFAULT_RESOURCE_TTL): Promise<HashTable<ParsedFlightType>> {
    const cacheKey = `flights-${url}`;
    const cachedData: BaseCachedFlightsType = (await this.getCache(cacheKey)) || {};
    // trying to receive data from provider within acceptable time
    const response = await makeRequest({ url, timeout: this.configService.get('loadersTimeout') }).catch(
      () => ({ status: HttpStatusCode.InternalServerError, data: {}, headers: {} } as AxiosResponse),
    );
    // if request failed or reached timeout - return cached data (or empty data if there is no cache yet)
    if (response.status !== HttpStatusCode.Ok) {
      return cachedData['data'] || {};
    }
    // checking conditions whether we can return data from cache
    // or provider returned a different snapshot of data
    if (this.mayApplyCache(response, cachedData)) {
      return cachedData['data'];
    }
    // processing/parsing provider data and updating cache for the resource
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
