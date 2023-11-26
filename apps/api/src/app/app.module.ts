import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@nx-next-nest-prisma-ory-template/auth';
import { DatabaseModule } from '@nx-next-nest-prisma-ory-template/database';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
