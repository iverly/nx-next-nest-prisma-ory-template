import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { KetoModule } from './keto/keto.module';
import { JwtStrategyModule } from './jwt-strategy/jwt-strategy.module';

@Module({
  imports: [PassportModule, JwtStrategyModule, KetoModule],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard, KetoModule],
})
export class AuthModule {}
