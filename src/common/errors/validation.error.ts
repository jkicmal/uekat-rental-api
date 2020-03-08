import { AppError } from './app.error';
import { ErrorType, StatusCode } from '../enums';

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, ErrorType.VALIDATION_ERROR, StatusCode.BAD_REQUEST);

    Error.captureStackTrace(this, ValidationError);
  }
}
