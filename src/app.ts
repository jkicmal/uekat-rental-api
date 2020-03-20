import Container, { Service, Inject } from 'typedi';
import { DatabaseError, ServerError } from './common/errors';
import { Database } from './database';
import { Server } from './server';
import { LoggerToken, Logger, ConfigToken } from './common/tokens';
import { Config } from './common/interfaces';

@Service()
export class App {
  constructor(@Inject(ConfigToken) private config: Config, @Inject(LoggerToken) private logger: Logger) {}

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

    const server = Container.get(Server);
    try {
      await server.init();
      this.logger.info(`Server started on port ${this.config.server.port}`);
    } catch (err) {
      throw new ServerError("Couldn't start server", err);
    }
  }
}
