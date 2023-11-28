import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { config } from './opentelemetry.config';
import { OpenTelemetryModule as NestOpenTelemetryModule } from 'nestjs-otel';

@Module({})
export class OpenTelemetryModule {
  static forRoot(): DynamicModule {
    if (process.env['OTEL_ENABLED'] !== 'true') {
      return {
        module: OpenTelemetryModule,
      };
    }

    return {
      module: OpenTelemetryModule,
      imports: [
        ConfigModule.forFeature(config),
        LoggerModule.forRoot({
          pinoHttp: {
            base: null,
            formatters: {
              level: (label: string) => ({ level: label }),
            },
            timestamp: () => `,"time":"${new Date().toISOString()}"`,
            redact: {
              paths: ['req.headers.authorization', 'req.headers.cookie'],
            },
          },
        }),
        NestOpenTelemetryModule.forRoot(),
      ],
      exports: [NestOpenTelemetryModule, LoggerModule],
    };
  }
}
