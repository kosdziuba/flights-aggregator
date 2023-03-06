import { CacheConfigInterface } from './types';

export const cache = (): CacheConfigInterface => ({
  cacheHost: process.env.CACHE_HOST,
  cachePort: parseInt(process.env.CACHE_PORT),
});
