export class AppError extends Error {
  public type: string;
  public status: number;
  public source: string;
  public originalError: Error;

  constructor(message: string, type: string, status: number, originalError: Error, source: string) {
    super(message);
    this.type = type;
    this.status = status;
    this.originalError = originalError;
    this.source = source;
  }
}
