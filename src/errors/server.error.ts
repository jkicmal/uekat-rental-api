import { AppError } from './app.error';

export class ServerError extends AppError {
  constructor(message: string, status: number, originalError: Error) {
    super(message, 'SERVER_ERROR', status, originalError, 'INTERNAL');
  }
}
