import { Module } from '@nestjs/common';
import { FlightsController } from '@controllers/flights';
import { FlightsService } from '@providers/flights';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [],
  controllers: [FlightsController],
  providers: [FlightsService],
})
class ApiModule {}

@Module({
  imports: [
    ApiModule,
    RouterModule.register([{ path: 'api', module: ApiModule }]),
  ],
})
export class AppModule {}
