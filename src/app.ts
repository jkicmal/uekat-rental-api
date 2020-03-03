import { Service } from 'typedi';
import { createConnection } from 'typeorm';
import { DatabaseError, ServerError } from './errors';
import { Server } from './server';

@Service()
export class App {
  constructor(private server: Server) {}

  public async start() {
    /**
     * Connect to the database and save connection in
     * typeorm instance
     */
    try {
      await createConnection();
      console.log('Connected to the database.');
    } catch (err) {
      throw new DatabaseError('Database connection failed.', 504, err);
    }

    /**
     * Start server
     */
    try {
      await this.server.start();
      console.log('Server started.');
    } catch (err) {
      throw new ServerError("Couldn't start server.", 504, err);
    }
  }
}
