import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { JoiUtil } from '@nx-next-nest-prisma-ory-template/config';

export interface JwtConfig {
  jwksUri: string;
  issuer: string;
}

export const config = registerAs('jwt', () => {
  const config = JoiUtil.validate<JwtConfig>({
    jwksUri: {
      value: process.env['API_JWT_JWKS_URI'],
      joi: Joi.string()
        .uri({
          scheme: ['https', 'http'],
        })
        .default(
          'http://oathkeeper.dev.nx-next-nest-prisma-ory-template.127.0.0.1.sslip.io/.well-known/jwks.json'
        ),
    },
    issuer: {
      value: process.env['API_JWT_ISSUER'],
      joi: Joi.string()
        .uri({
          scheme: ['https', 'http'],
        })
        .default('http://oathkeeper.nx-next-nest-prisma-ory-template.internal'),
    },
  });

  return config;
});
