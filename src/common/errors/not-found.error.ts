import { AppError } from './app.error';
import { ErrorType, StatusCode } from '../enums';

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, ErrorType.NOT_FOUND, StatusCode.NOT_FOUND);

    Error.captureStackTrace(this, NotFoundError);
  }
}
