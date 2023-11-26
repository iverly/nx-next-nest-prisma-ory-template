import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@nx-next-nest-prisma-ory-template/auth';
import { DatabaseModule } from '@nx-next-nest-prisma-ory-template/database';
import { OpenTelemetryModule } from '@nx-next-nest-prisma-ory-template/opentelemetry';

@Module({
  imports: [
    OpenTelemetryModule.forRoot(),
    ConfigModule.forRoot(),
    AuthModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
