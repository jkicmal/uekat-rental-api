export interface Config {
  jwt: {
    secret: string;
    expiresIn: string;
  };
  server: {
    port: number;
  };
}
