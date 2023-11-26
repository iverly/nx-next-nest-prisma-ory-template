import { Logger, ValidationPipe } from '@nestjs/common';
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

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  const httpAdapter = app.getHttpAdapter();

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

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Application is running on port: ${port}`);
}

bootstrap();
