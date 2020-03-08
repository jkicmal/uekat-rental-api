import winston from 'winston';
import Container, { Token } from 'typedi';

export interface Logger extends winston.Logger {}

export const LoggerToken = new Token<Logger>();

const createLogger = () => {
  return winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.prettyPrint()
    ),
    transports: [new winston.transports.Console()]
  });
};

Container.set(LoggerToken, createLogger());
