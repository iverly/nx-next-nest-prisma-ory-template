import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './database.config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forFeature(config)],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
