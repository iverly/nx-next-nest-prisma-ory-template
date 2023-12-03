// Otel must be imported before any other modules
import {
  otelEnabled,
  otelSDK,
} from '@nx-next-nest-prisma-ory-template/opentelemetry';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import {
  ExceptionsFilter,
  PrismaClientExceptionFilter,
} from '@nx-next-nest-prisma-ory-template/error';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseFormatterInterceptor } from '@nx-next-nest-prisma-ory-template/utils';
import { Logger } from 'nestjs-pino';
import helmet from '@fastify/helmet';
import csrf from '@fastify/csrf-protection';

async function bootstrap() {
  if (otelEnabled) {
    await otelSDK.start();
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    }
  );

  if (otelEnabled) {
    app.useLogger(app.get(Logger));
  }

  const httpAdapter = app.getHttpAdapter();

  // Security plugins
  app.enableCors();
  await app.register(helmet);
  await app.register(csrf);

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      skipNullProperties: false,
      skipUndefinedProperties: false,
    })
  );

  // Errors filters
  app.useGlobalFilters(
    new ExceptionsFilter(httpAdapter),
    new PrismaClientExceptionFilter(httpAdapter)
  );

  // Response formatter interceptor
  app.useGlobalInterceptors(new ResponseFormatterInterceptor());

  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('nx-next-nest-prisma-ory-template API')
    .setDescription('Your NX template to provide a Seamless Experience.')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  const port = process.env.PORT || 3100;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
