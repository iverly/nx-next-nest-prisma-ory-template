import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@nx-next-nest-prisma-ory-template/auth';
import { DatabaseModule } from '@nx-next-nest-prisma-ory-template/database';
import { NotesModule } from '@nx-next-nest-prisma-ory-template/notes';
import { OpenTelemetryModule } from '@nx-next-nest-prisma-ory-template/opentelemetry';

@Module({
  imports: [
    OpenTelemetryModule.forRoot(),
    ConfigModule.forRoot(),
    AuthModule,
    DatabaseModule,
    NotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
