export interface Config {
  jwt: {
    secret: string;
    expiresIn: number;
  };
  server: {
    port: number;
  };
}
