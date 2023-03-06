import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import * as process from 'process';

import { FlightsController } from '@controllers/flights';

import { CacheConfigService } from '@providers/cache_config_service';
import { FlightsService } from '@providers/flights';

import { base, cache, flightsProviders } from './config';

@Module({
  imports: [HttpModule],
  controllers: [FlightsController],
  providers: [FlightsService],
})
class ApiModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE_PATH || '.env',
      isGlobal: true,
      load: [base, flightsProviders, cache],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: CacheConfigService,
      isGlobal: true,
      inject: [ConfigModule],
    }),
    ApiModule,
    RouterModule.register([{ path: 'api', module: ApiModule }]),
  ],
  providers: [CacheConfigService],
})
export class AppModule {}
