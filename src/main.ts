import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { SnakeCaseInterceptor } from './interceptors';

declare const module: any;

async function bootstrap(): Promise<void> {
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

bootstrap();
