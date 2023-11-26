import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  RequestMapping,
  RequestMethod,
} from '@nestjs/common';
import {
  ApiBody,
  ApiBodyOptions,
  ApiOperation,
  ApiOperationOptions,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
  ApiResponseOptions,
} from '@nestjs/swagger';
import { ResponseFormatter } from '../formatters/response-formatter';
import { Pagination } from '../helpers/paginate';

export interface ApiRouteOptions {
  method: RequestMethod;
  path?: string;
  operation: ApiOperationOptions;
  response: ApiResponseOptions;
  params?: ApiParamOptions[];
  body?: ApiBodyOptions;
  others?: (MethodDecorator & ClassDecorator)[];
  pagination?: boolean;
}

export const ApiRoute = (options: ApiRouteOptions) =>
  applyDecorators(
    RequestMapping({
      path: options.path,
      method: options.method,
    }),
    ...((options.operation && [ApiOperation(options.operation)]) || []),
    ...((options.response && [
      ...((Number.isFinite(options.response.status) && [
        HttpCode(options.response.status as number),
      ]) ||
        []),
      ApiResponse(
        ResponseFormatter.formatApiResponseOptions(options.response, {
          ...(options.pagination && {
            pagination: {
              type: 'object',
              required: ['page', 'limit'],
              properties: {
                page: {
                  type: 'number',
                  description: 'Page number for pagination',
                },
                limit: {
                  type: 'number',
                  description: 'Number of item per page for pagination',
                },
                total: {
                  type: 'number',
                  description: 'Total number of items',
                },
              },
            },
          }),
        })
      ),
    ]) ||
      []),
    ...((options.body && [ApiBody(options.body)]) || []),
    ...(options.params || []).map((param) => ApiParam(param)),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error occurred',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad request error occurred',
    }),
    ...(options.others || []),
    ...((options.pagination && [Pagination()]) || [])
  );
