import { Service, Container } from 'typedi';
import { createExpressServer, useContainer, Action } from 'routing-controllers';
import { CustomErrorHandlerMiddleware } from './middlewares';
import { AccountRepository } from './repositories';
import { getRepository } from 'typeorm';
import { Account } from './entities';

@Service()
export class Server {
  public async init() {
    useContainer(Container);
    const app = createExpressServer({
      authorizationChecker: async (action: Action, roles: string[]) => {
        // const accountRepository = Container.get(AccountRepository);
        const accountRepository = getRepository(Account);

        /**
         * Get token from authorization header
         */
        const authHeader: string = action.request.headers['authorization'];

        /**
         * Check if header content is correct
         */
        if (!authHeader || authHeader.indexOf('Bearer') === -1) return false;

        /**
         * Check if token exists
         */
        const token = authHeader.split(' ')[1];
        if (!token) throw false;

        /**
         * Get account with roles from
         */
        const account = await accountRepository.findOne({ token: token }, { relations: ['roles'] });

        /**
         * If no roles specified, let through
         */
        if (account && !roles.length) return true;

        /**
         * If account contains one of the roles, let through
         */
        if (account && account.roles.find(role => roles.includes(role.name))) return true;

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
