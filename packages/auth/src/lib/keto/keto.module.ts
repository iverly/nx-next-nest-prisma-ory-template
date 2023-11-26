import { Module } from '@nestjs/common';
import { KetoService } from './keto.service';
import { ConfigModule } from '@nestjs/config';
import { config } from './keto.config';

@Module({
  imports: [ConfigModule.forFeature(config)],
  providers: [KetoService],
  exports: [KetoService],
})
export class KetoModule {}
