import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

import { HashTable } from '@utils/types';

import { getLoadersMap } from './loaders';
import { ParsedFlightType } from './loaders/types';

@Injectable()
export class FlightsService {
  constructor(private configService: ConfigService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getFlights(): Promise<ParsedFlightType[]> {
    let results: HashTable<ParsedFlightType> = {};
    // getting available flights in parallel
    const loadersMap = getLoadersMap(this.cacheManager, this.configService);
    const loadedResults: HashTable<ParsedFlightType>[] = await Promise.all(
      this.configService
        .get('flightsProviders')
        .map((provider) => loadersMap[provider.loader].load(provider.url, provider.ttl)),
    );
    // removing the duplicates
    loadedResults.map((part) => {
      results = { ...results, ...part };
    });
    return Object.values(results);
  }
}
