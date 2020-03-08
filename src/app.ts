import Container, { Service } from 'typedi';
import { DatabaseError, ServerError } from './errors';
import { Database } from './database';
import { Server } from './server';

@Service()
export class App {
  public async init() {
    /**
     * Connect to the database and save connection in
     * typeorm instance
     */
    const database = Container.get(Database);
    try {
      await database.init();
      console.log('Connected to the database');
    } catch (err) {
      throw new DatabaseError('Database connection failed', err);
    }

    /**
     * Start server
     */
    const server = Container.get(Server);
    try {
      await server.init();
      console.log('Server started');
    } catch (err) {
      throw new ServerError("Couldn't start server", err);
    }
  }
}
