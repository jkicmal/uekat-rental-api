import { ErrorType, StatusCode } from '../enums';

export class AppError extends Error {
  public type: string;
  public status: number;
  public originalError: Error | null;
  public isOperational: boolean;

  constructor(message: string, type: ErrorType, status: StatusCode, originalError?: Error) {
    super(message);

    this.type = type || ErrorType.APP_ERROR;
    this.status = status || StatusCode.INTERNAL_SERVER_ERROR;
    this.originalError = originalError || null;

    this.isOperational = true;

    Error.captureStackTrace(this, AppError);
  }
}
