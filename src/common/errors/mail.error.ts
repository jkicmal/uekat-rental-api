import { AppError } from './app.error';
import { ErrorType } from '../enums';

export class MailError extends AppError {
  constructor(message: string, originalError: Error) {
    super(message, ErrorType.MAIL_ERROR, 0, originalError);

    Error.captureStackTrace(this, MailError);
  }
}
