import { AppError } from './app.error';
import { ErrorType, StatusCode } from '../enums';

export class UknownServerError extends AppError {
  constructor(message: string, originalError: Error) {
    super(message, ErrorType.UNKNOWN_SERVER_ERROR, StatusCode.INTERNAL_SERVER_ERROR, originalError);

    Error.captureStackTrace(this, UknownServerError);
  }
}
