import {
  ExpressErrorMiddlewareInterface,
  Middleware,
  ForbiddenError as RoutingControllersForbiddenError,
  UnauthorizedError
} from 'routing-controllers';
import { Service, Inject } from 'typedi';
import { Request, Response } from 'express';
import { ForbiddenError, UknownServerError } from '../common/errors';
import { TokenExpiredError } from 'jsonwebtoken';
import { LoggerToken, Logger, ConfigToken } from '../common/tokens';
import { Config } from '../common/interfaces';

@Service()
@Middleware({ type: 'after' })
export class CustomErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  constructor(@Inject(LoggerToken) private logger: Logger, @Inject(ConfigToken) private config: Config) {}

  error(error: any, request: Request, response: Response) {
    // Log error before any modifications
    this.logger.error({ error: 'ORIGINAL ERROR OBJECT', ...error });

    // Catch errors from different libraries
    if (error instanceof RoutingControllersForbiddenError) error = new ForbiddenError('Access denied');
    if (error instanceof TokenExpiredError) error = new ForbiddenError('Token expired');
    if (error instanceof UnauthorizedError) error = new ForbiddenError('Authorization required');

    // Catch any unhadled errors
    if (!error.isOperational) error = new UknownServerError('Uknown error', error);

    // Handle error response
    const errorPayload = {
      error: error.type,
      message: error.message,
      stack: error.stack,
      originalError: error.originalError
    };

    this.logger.warn({ ...errorPayload });

    return response.status(error.status).json({
      data: errorPayload
    });
  }
}
