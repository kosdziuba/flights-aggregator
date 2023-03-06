import { CacheConfigInterface } from './types';

export const cache = (): CacheConfigInterface => ({
  cacheHost: process.env.CACHE_HOST || 'localhost',
  cachePort: parseInt(process.env.CACHE_PORT) || 6379,
});
