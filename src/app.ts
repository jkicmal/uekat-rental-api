import Container, { Service, Inject } from 'typedi';
import { DatabaseError, ServerError } from './common/errors';
import { Database } from './database';
import { Server } from './server';
import { LoggerToken, Logger } from './common/tokens';

@Service()
export class App {
  constructor(@Inject(LoggerToken) private logger: Logger) {}

  public async init() {
    /**
     * Connect to the database and save connection in
     * typeorm instance
     */
    const database = Container.get(Database);
    try {
      await database.init();
      this.logger.info('Connected to the database');
    } catch (err) {
      throw new DatabaseError('Database connection failed', err);
    }

    /**
     * Start server
     */
    const server = Container.get(Server);
    try {
      await server.init();
      this.logger.info('Server started');
    } catch (err) {
      throw new ServerError("Couldn't start server", err);
    }
  }
}
