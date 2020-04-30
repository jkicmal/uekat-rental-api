import Container, { Token } from 'typedi';
import { Config } from '../interfaces';

export const ConfigToken = new Token<Config>();

const config: Config = {
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: Number(process.env.JWT_EXPIRES_IN) || 0
  },
  server: {
    port: Number(process.env.PORT) || 3000
  },
  mail: {
    enabled: !!process.env.SMTP_MAIL_ENABLED,
    host: process.env.SMTP_MAIL_HOST || '',
    port: Number(process.env.SMTP_MAIL_PORT),
    secure: !!process.env.SMTP_MAIL_SECURE,
    user: process.env.SMTP_MAIL_USER || '',
    pass: process.env.SMTP_MAIL_PASS || ''
  }
};

Container.set(ConfigToken, config);
