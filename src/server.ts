import { Service } from 'typedi';
import express, { Express, Request, Response } from 'express';

@Service()
export class Server {
  private _instance: Express;
  public start() {
    this._instance = express();

    this._instance.get('/', (req: Request, res: Response) => {
      res.status(200).send('OK');
    });

    this._instance.listen(3000);
  }
}
