import { AppError } from './app.error';

export class DatabaseError extends AppError {
  constructor(message: string, status: number, originalError: Error) {
    super(message, 'DATABASE_ERROR', status, originalError, 'INTERNAL');
  }
}
