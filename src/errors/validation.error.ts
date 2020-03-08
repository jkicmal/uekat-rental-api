import { AppError } from './app.error';
import { ErrorType, ErrorSource } from '../enums';

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, ErrorType.VALIDATION_ERROR, 400, ErrorSource.INTERNAL);

    Error.captureStackTrace(this, ValidationError);
  }
}
