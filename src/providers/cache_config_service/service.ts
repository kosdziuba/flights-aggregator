import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}
  createCacheOptions(): CacheModuleOptions {
    const config = { isGlobal: true };

    if (this.configService.get('cacheHost') && this.configService.get('cachePort')) {
      config['store'] = redisStore;
      config['socket'] = {
        host: this.configService.get('cacheHost'),
        port: this.configService.get('cachePort'),
      };
    }

    return config;
  }
}
