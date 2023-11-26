import { Logger } from '@nestjs/common';
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

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const httpAdapter = app.getHttpAdapter();

  // Errors filters
  app.useGlobalFilters(
    new ExceptionsFilter(httpAdapter),
    new PrismaClientExceptionFilter(httpAdapter)
  );

  app.enableShutdownHooks();

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Application is running on port: ${port}`);
}

bootstrap();
