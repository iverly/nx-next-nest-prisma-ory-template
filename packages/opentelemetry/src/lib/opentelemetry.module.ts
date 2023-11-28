import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { config } from './opentelemetry.config';
import { OpenTelemetryModule as NestOpenTelemetryModule } from 'nestjs-otel';
import { trace, context } from '@opentelemetry/api';

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
              log(object) {
                const span = trace.getSpan(context.active());
                if (!span) {
                  return { ...object };
                }

                const { spanId, traceId } = span.spanContext();
                return { ...object, spanId, traceId };
              },
            },
            timestamp: () => `,"time":"${new Date().toISOString()}"`,
            redact: {
              paths: ['req.headers.authorization', 'req.headers.cookie'],
            },
          },
        }),
        NestOpenTelemetryModule.forRoot({
          metrics: {
            hostMetrics: true,
            apiMetrics: {
              enable: true,
              ignoreRoutes: ['/favicon.ico'],
              ignoreUndefinedRoutes: true,
            },
          },
        }),
      ],
      exports: [NestOpenTelemetryModule, LoggerModule],
    };
  }
}
