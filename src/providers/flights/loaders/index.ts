import { BaseFlightsProviderLoader } from '@providers/flights/loaders/base';
import { CodingChallengeLoader } from '@providers/flights/loaders/coding-challenge-loader';

import { HashTable } from '@utils/types';

export const LOADERS_MAP: HashTable<typeof BaseFlightsProviderLoader> = {
  'coding-challenge': CodingChallengeLoader,
};
