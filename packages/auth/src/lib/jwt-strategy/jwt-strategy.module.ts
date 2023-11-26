import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './jwt-strategy.config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [ConfigModule.forFeature(config)],
  providers: [JwtStrategy],
  exports: [JwtStrategy],
})
export class JwtStrategyModule {}
