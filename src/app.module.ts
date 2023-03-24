import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import * as process from 'process';

import { FlightsController } from '@controllers/flights';

import { FlightsService } from '@providers/flights';
import { PrismaService } from '@providers/prisma';
import { TasksService } from '@providers/tasks';

import { base, flightsProviders } from './config';

@Module({
  imports: [HttpModule],
  controllers: [FlightsController],
  providers: [FlightsService, PrismaService],
})
class ApiModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE_PATH || '.env',
      isGlobal: true,
      load: [base, flightsProviders],
    }),
    ApiModule,
    RouterModule.register([{ path: 'api', module: ApiModule }]),
  ],
})
export class AppModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE_PATH || '.env',
      isGlobal: true,
      load: [base, flightsProviders],
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [PrismaService, TasksService, FlightsService],
})
export class TasksModule {}
