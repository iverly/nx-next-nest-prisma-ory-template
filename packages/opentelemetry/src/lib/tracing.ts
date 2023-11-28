import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from '@opentelemetry/core';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

export const otelEnabled = process.env['OTEL_ENABLED'] === 'true';

export const otelSDK = new NodeSDK({
  metricReader: new PrometheusExporter({
    port: 9100,
  }),
  spanProcessor: new BatchSpanProcessor(new JaegerExporter()),
  contextManager: new AsyncLocalStorageContextManager(),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new JaegerPropagator(),
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
  instrumentations: [
    ...(otelEnabled
      ? [
          new HttpInstrumentation(),
          new FastifyInstrumentation(),
          new NestInstrumentation(),
          new PrismaInstrumentation(),
          new PinoInstrumentation(),
        ]
      : []),
  ],
});
