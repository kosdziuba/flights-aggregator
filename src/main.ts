import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import axios from 'axios';

import { dateTransformer } from '@utils/types';

import { AppModule, TasksModule } from './app.module';
import { APP_SCOPES } from './config';
import { SnakeCaseInterceptor } from './interceptors';

declare const module: any;

const logger = new Logger('Main');

async function runApi(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new SnakeCaseInterceptor());

  const configService = app.get(ConfigService);
  const host = configService.get('host', 'localhost');
  const port = configService.get('port', 3000);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Flights aggregator')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {});
  SwaggerModule.setup('api', app, document);

  await app.listen(port, host);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

async function runTasks(): Promise<void> {
  const app = await NestFactory.create(TasksModule);

  await app.listen(46987);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

async function bootstrap(): Promise<void> {
  axios.defaults.transformResponse = [dateTransformer];

  const scope = process.env.APP_SCOPE || APP_SCOPES.API;
  if (scope === APP_SCOPES.API) {
    logger.log('Starting Api Application');
    await runApi();
  }
  if (scope === APP_SCOPES.TASKS) {
    logger.log('Starting Tasks Application');
    await runTasks();
  }
}

bootstrap();
