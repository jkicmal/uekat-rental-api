export interface Config {
  jwt: {
    secret: string;
    expiresIn: number;
  };
  server: {
    port: number;
  };
  mail: {
    enabled: boolean;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
  };
}
