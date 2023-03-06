import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

import { BaseFlightsProviderLoader } from '@providers/flights/loaders/base';
import { CodingChallengeLoader } from '@providers/flights/loaders/coding-challenge-loader';

import { HashTable, objectMap } from '@utils/types';

export const LOADERS_MAP: HashTable<typeof BaseFlightsProviderLoader> = {
  'coding-challenge': CodingChallengeLoader,
};

export function getLoadersMap(cacheManager: Cache, configService: ConfigService): HashTable<BaseFlightsProviderLoader> {
  return objectMap(LOADERS_MAP, (value) => new value(cacheManager, configService));
}
