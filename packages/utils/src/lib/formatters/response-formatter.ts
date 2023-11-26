import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';

export class ResponseFormatter {
  static format(response: unknown, metadata: Record<string, unknown> = {}) {
    return {
      metadata: {
        count: Array.isArray(response) ? response.length : undefined,
        ...metadata,
      },
      data: response,
    };
  }

  static formatApiResponseOptions(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: any,
    metadata: Record<string, unknown> = {}
  ): ApiResponseOptions {
    if (response.schema) {
      response.schema = {
        type: 'object',
        required: ['metadata', 'data'],
        properties: {
          metadata: {
            type: 'object',
            properties: {
              ...(response.schema?.type == 'array' && {
                count: {
                  type: 'number',
                  description: 'Total number of returned items',
                },
              }),
              ...metadata,
            },
          },
          data: response.schema,
        },
      };
    }

    return response;
  }
}

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((response) =>
        ResponseFormatter.format(response, {
          ...(request.pagination && {
            pagination: {
              page: request.pagination.page,
              limit: request.pagination.limit,
              total: request.pagination.total,
            },
          }),
        })
      )
    );
  }
}
