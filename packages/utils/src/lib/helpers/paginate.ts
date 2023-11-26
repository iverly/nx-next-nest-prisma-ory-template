import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
  applyDecorators,
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Observable } from 'rxjs';

export interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
  total?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fastify, { FastifyRequest } from 'fastify';
declare module 'fastify' {
  interface FastifyRequest {
    pagination?: PaginationResult;
  }
}

@Injectable()
export class PaginationPipe implements PipeTransform {
  private defaultLimit: number;
  private maxLimit: number;

  constructor(defaultLimit = 10, maxLimit = 100) {
    this.defaultLimit = defaultLimit;
    this.maxLimit = maxLimit;
  }

  transform(request: FastifyRequest): PaginationResult {
    const query = request.query as Record<string, unknown>;

    const page = parseInt(query['page'] as string) || 1;
    const limit = parseInt(query['limit'] as string) || this.defaultLimit;

    if (typeof page !== 'number' || !isFinite(page) || page < 1) {
      throw new BadRequestException();
    }

    if (
      typeof limit !== 'number' ||
      !isFinite(limit) ||
      limit < 1 ||
      limit > this.maxLimit
    ) {
      throw new BadRequestException();
    }

    return {
      page,
      limit,
      offset: (page - 1) * limit,
    };
  }
}

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  private options: PaginationOptions;

  constructor(options: PaginationOptions) {
    this.options = options;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const request = context.switchToHttp().getRequest();

    const paginationResult = new PaginationPipe(
      this.options.defaultLimit,
      this.options.maxLimit
    ).transform(request);
    request.pagination = paginationResult;

    return next.handle();
  }
}

export const Pagination = (options: PaginationOptions = {}) =>
  applyDecorators(
    UseInterceptors(new PaginationInterceptor(options)),
    ApiQuery({
      name: 'page',
      description: 'Page number for pagination',
      type: 'number',
      required: false,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Number of item per page for pagination',
      type: 'number',
      required: false,
    })
  );
