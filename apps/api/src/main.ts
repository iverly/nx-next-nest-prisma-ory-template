import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Application is running on port: ${port}`);
}

bootstrap();
