import { Service, Container } from 'typedi';
import { createExpressServer, useContainer, Action } from 'routing-controllers';
import { InjectRepository } from 'typeorm-typedi-extensions';
import jwt from 'jsonwebtoken';
import { CustomErrorHandlerMiddleware } from './middlewares';
import { AccountRepository } from './repositories';
import { Account } from './entities';

@Service()
export class Server {
  // constructor(private authorizationCheckerMiddleware: AuthorizationCheckerMiddleware) {}

  // TODO: Move this dependency to different module
  constructor(@InjectRepository(Account) private accountRepository: AccountRepository) {}

  public async init() {
    useContainer(Container);

    const app = createExpressServer({
      // TODO: Move this function to different module
      authorizationChecker: async (action: Action, roles: string[]) => {
        // Check if correct header exists
        const authHeader: string = action.request.headers['authorization'];
        if (!authHeader || authHeader.indexOf('Bearer') === -1) return false;

        // Check if token exists
        const token = authHeader.split(' ')[1];
        if (!token) throw false;

        // Verify token
        jwt.verify(token, 'secret');

        // Search for account with that token
        const account = await this.accountRepository.findOne({ token: token }, { relations: ['roles'] });

        // If account was found and there are no roles specified - authorize successfuly
        if (account && !roles.length) return true;

        // If account was found and has specified role assigned - authorize successfulyy
        if (account && account.roles.find(role => roles.includes(role.name))) return true;

        // Otherwise deny access
        return false;
      },
      cors: true,
      defaultErrorHandler: false,
      controllers: [__dirname + '/controllers/*.controller.ts'],
      middlewares: [CustomErrorHandlerMiddleware]
    });

    await app.listen(3000);
  }
}
