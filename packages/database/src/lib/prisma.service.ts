import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    for (let i = 0; i < 10; i++) {
      try {
        await this.$connect();
        return;
      } catch (e) {
        this.logger.error(`Failed to connect to database (${i})`);
        this.logger.error(e);
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
}
