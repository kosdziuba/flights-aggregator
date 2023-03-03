import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

import { FlightsController } from '@controllers/flights';

import { FlightsService } from '@providers/flights';

import { base, cache, flightsProviders } from './config';

@Module({
  imports: [],
  controllers: [FlightsController],
  providers: [FlightsService],
})
class ApiModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [base, flightsProviders, cache],
    }),
    ApiModule,
    RouterModule.register([{ path: 'api', module: ApiModule }]),
  ],
})
export class AppModule {}
