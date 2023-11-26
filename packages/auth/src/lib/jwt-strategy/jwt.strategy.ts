import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { IdToken } from '@nx-next-nest-prisma-ory-template/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fastify from 'fastify';
declare module 'fastify' {
  interface FastifyRequest {
    user: IdToken;
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<Record<string, unknown>, true>) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.get<string>('jwt.jwksUri'),
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: configService.get<string>('jwt.issuer'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: IdToken) {
    return payload;
  }
}
