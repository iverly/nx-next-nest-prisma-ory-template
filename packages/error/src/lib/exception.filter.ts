import {
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

const isProduction = process.env.NODE_ENV === 'production';

const defaultMessages = [
  {
    status: 400,
    message:
      'The request could not be understood by the server due to malformed syntax.',
  },
  {
    status: 401,
    message: 'The request requires user authentication.',
  },
  {
    status: 404,
    message: 'The server has not found anything matching the Request-URI.',
  },
  {
    status: 403,
    message:
      'The server understood the request, but is refusing to fulfill it.',
  },
  {
    status: 406,
    message: 'The server has not found anything matching the Request-URI.',
  },
  {
    status: 408,
    message:
      'The server understood the request, but is refusing to fulfill it.',
  },
  {
    status: 409,
    message:
      'The request could not be completed due to a conflict with the current state of the resource.',
  },
  {
    status: 410,
    message: 'The requested resource is no longer available at the server.',
  },
  {
    status: 505,
    message:
      'The server does not support the HTTP protocol version used in the request.',
  },
  {
    status: 413,
    message:
      'The server is refusing to process a request because the request payload is larger than the server is willing or able to process.',
  },
  {
    status: 415,
    message:
      'The server is refusing to service the request because the entity of the request is in a format not supported by the requested resource for the requested method.',
  },
  {
    status: 422,
    message:
      'The server understands the content type of the request entity, and the syntax of the request entity is correct, but the server was unable to process the contained instructions.',
  },
  {
    status: 500,
    message:
      'The server encountered an unexpected condition which prevented it from fulfilling the request.',
  },
  {
    status: 501,
    message:
      'The server does not support the functionality required to fulfill the request.',
  },
  {
    status: 418,
    message:
      'The server refuses to brew coffee because it is, permanently, a teapot.',
  },
  {
    status: 405,
    message: 'The server has not found anything matching the Request-URI.',
  },
  {
    status: 502,
    message:
      'The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request.',
  },
  {
    status: 503,
    message:
      'The server is currently unable to handle the request due to a temporary overloading or maintenance of the server.',
  },
  {
    status: 504,
    message:
      'The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server specified by the URI.',
  },
  {
    status: 412,
    message:
      'The precondition given in one or more of the request-header fields evaluated to false when it was tested on the server.',
  },
];

@Catch(HttpException)
export class ExceptionsFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      return exception;
    }

    if (!isProduction) {
      return super.catch(exception, host);
    }

    const defaultException = defaultMessages.find(
      (item) => item.status === exception.getStatus()
    );

    if (!defaultException) {
      return super.catch(new InternalServerErrorException(), host);
    }

    return super.catch(
      new HttpException(defaultException.message, exception.getStatus()),
      host
    );
  }
}
