import { AppError } from './app.error';
import { ErrorType, StatusCode } from '../enums';

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, ErrorType.FORBIDDEN, StatusCode.FORBIDDEN);

    Error.captureStackTrace(this, ForbiddenError);
  }
}
