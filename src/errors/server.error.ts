import { AppError } from './app.error';
import { ErrorType, ErrorSource } from '../enums';

export class ServerError extends AppError {
  constructor(message: string, originalError: Error) {
    super(message, ErrorType.SERVER_ERROR, 500, ErrorSource.INTERNAL, originalError);

    Error.captureStackTrace(this, ServerError);
  }
}
