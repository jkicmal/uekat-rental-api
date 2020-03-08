import { AppError } from './app.error';
import { ErrorType, ErrorSource, StatusCode } from '../enums';

export class DatabaseError extends AppError {
  constructor(message: string, originalError: Error) {
    super(message, ErrorType.DATABASE_ERROR, StatusCode.INTERNAL_SERVER_ERROR, ErrorSource.INTERNAL, originalError);

    Error.captureStackTrace(this, DatabaseError);
  }
}
