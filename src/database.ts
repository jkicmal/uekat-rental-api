import { Service, Container } from 'typedi';
import { useContainer, createConnection } from 'typeorm';

@Service()
export class Database {
  constructor() {
    useContainer(Container);
  }

  public async init() {
    await createConnection();
  }
}
