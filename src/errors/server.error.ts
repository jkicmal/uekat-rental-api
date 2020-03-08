import { AppError } from './app.error';
import { ErrorType, StatusCode } from '../enums';

export class ServerError extends AppError {
  constructor(message: string, originalError: Error) {
    super(message, ErrorType.SERVER_ERROR, StatusCode.INTERNAL_SERVER_ERROR, originalError);

    Error.captureStackTrace(this, ServerError);
  }
}
