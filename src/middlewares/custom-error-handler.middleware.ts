import {
  ExpressErrorMiddlewareInterface,
  Middleware,
  ForbiddenError as RoutingControllersForbiddenError
} from 'routing-controllers';
import { Service } from 'typedi';
import { Request, Response } from 'express';
import { AppError, ForbiddenError } from '../errors';
import { ErrorType } from '../enums';
import { TokenExpiredError } from 'jsonwebtoken';

@Service()
@Middleware({ type: 'after' })
export class CustomErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response, next: Function) {
    console.log(`ERROR CONSTRUCTOR: ${error.constructor.name}`);

    console.log(error);

    if (error instanceof RoutingControllersForbiddenError) error = new ForbiddenError('Access denied');
    if (error instanceof TokenExpiredError) error = new ForbiddenError('Token expired');
    if (error.isOperational) this.handleOperationalError(response, error);
    else this.handleUnknownError(response, error);

    next();
  }

  private handleOperationalError(response: Response, error: AppError) {
    return response.status(error.status).json({
      data: {
        error: error.type,
        message: error.message,
        stack: error.stack,
        originalError: error.originalError
      }
    });
  }

  private handleUnknownError(response: Response, error: Error) {
    return response.status(500).json({
      data: {
        error: ErrorType.UNKNOWN_SERVER_ERROR,
        message: 'Uknown error occured',
        originalError: error
      }
    });
  }
}
