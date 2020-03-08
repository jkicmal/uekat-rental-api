import { AppError } from './app.error';
import { ErrorType, ErrorSource, StatusCode } from '../enums';

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, ErrorType.FORBIDDEN, StatusCode.FORBIDDEN, ErrorSource.EXTERNAL);

    Error.captureStackTrace(this, ForbiddenError);
  }
}
