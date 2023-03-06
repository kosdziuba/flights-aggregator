import { AxiosResponse } from 'axios';

import { BaseFlightsProviderLoader } from '@providers/flights/loaders/base';
import { DEFAULT_RESOURCE_TTL } from '@providers/flights/loaders/constants';
import { CachedFlightsType, MakeFlightsMethodResultType, ParsedFlightType } from '@providers/flights/loaders/types';

import { HashTable } from '@utils/types';

export class CodingChallengeLoader extends BaseFlightsProviderLoader {
  protected parseResponseData(responseData: object): HashTable<ParsedFlightType> {
    const flights = responseData['flights'] || [];
    return Object.fromEntries(
      flights.map((entry) => {
        const { uid, flights } = this.makeFlights(entry);
        return [uid, flights];
      }),
    );
  }

  private makeFlights(entry: object): MakeFlightsMethodResultType {
    const flights: ParsedFlightType = {
      departingFlight: entry['slices'][0],
      returnFlight: entry['slices'][1],
      price: entry['price'],
    };
    const uid =
      `${flights.departingFlight.flightNumber}:${flights.departingFlight.departureDateTimeUtc}` +
      `<->${flights.returnFlight.flightNumber}:${flights.returnFlight.departureDateTimeUtc}`;
    return { uid, flights };
  }

  protected async setCache(
    cacheKey: string,
    data: HashTable<ParsedFlightType>,
    response: AxiosResponse<any>,
    resourceTtl = DEFAULT_RESOURCE_TTL,
  ): Promise<void> {
    await this.cacheManager.set(cacheKey, { data, etag: response.headers['etag'] }, resourceTtl);
  }

  protected mayApplyCache(response: AxiosResponse<any>, cachedData: CachedFlightsType): boolean {
    return (
      cachedData['etag'] &&
      cachedData['data'] &&
      (response.headers['etag'] === cachedData['etag'] || !response.headers['etag'])
    );
  }
}
