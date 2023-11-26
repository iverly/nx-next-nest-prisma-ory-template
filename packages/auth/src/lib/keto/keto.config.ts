import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { JoiUtil } from '@nx-next-nest-prisma-ory-template/config';

export interface DatabaseConfig {
  readUrl: string;
  writeUrl: string;
}

export const config = registerAs('keto', () =>
  JoiUtil.validate<DatabaseConfig>({
    readUrl: {
      value: process.env['KETO_READ_API_URL'],
      joi: Joi.string()
        .uri({
          scheme: ['https', 'http'],
        })
        .default(
          'http://keto.dev.nx-next-nest-prisma-ory-template.127.0.0.1.sslip.io/read'
        ),
    },
    writeUrl: {
      value: process.env['KETO_WRITE_API_URL'],
      joi: Joi.string()
        .uri({
          scheme: ['https', 'http'],
        })
        .default(
          'http://keto.dev.nx-next-nest-prisma-ory-template.127.0.0.1.sslip.io/write'
        ),
    },
  })
);
