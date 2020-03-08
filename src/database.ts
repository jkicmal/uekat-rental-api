import { Service, Container } from 'typedi';
import { useContainer, createConnection } from 'typeorm';

@Service()
export class Database {
  public async init() {
    useContainer(Container);
    await createConnection();
  }
}
