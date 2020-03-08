import Container, { Token } from 'typedi';
import { Config } from '../interfaces';

export const ConfigToken = new Token<Config>();

const config: Config = {
  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRES_IN || ''
  },
  server: {
    port: Number(process.env.PORT) || 3000
  }
};

Container.set(ConfigToken, config);
