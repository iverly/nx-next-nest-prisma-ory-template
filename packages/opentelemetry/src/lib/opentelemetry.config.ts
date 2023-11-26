import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { JoiUtil } from '@nx-next-nest-prisma-ory-template/config';

export interface OpenTelemetryConfig {
  enabled: boolean;
  serviceName: string;
  exporterJaegerEndpoint: string;
}

export const config = registerAs('otel', () =>
  JoiUtil.validate<OpenTelemetryConfig>({
    enabled: {
      value: process.env['OTEL_ENABLED'],
      joi: Joi.boolean().default(false),
    },
    serviceName: {
      value: process.env['OTEL_SERVICE_NAME'],
      joi: Joi.string().required(),
    },
    exporterJaegerEndpoint: {
      value: process.env['OTEL_EXPORTER_JAEGER_ENDPOINT'],
      joi: Joi.string()
        .uri({
          scheme: ['http', 'https'],
        })
        .required(),
    },
  })
);
