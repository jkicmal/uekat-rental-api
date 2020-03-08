import { Service, Container, Inject } from 'typedi';
import { createExpressServer, useContainer, Action } from 'routing-controllers';
import morgan from 'morgan';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CustomErrorHandlerMiddleware } from './middlewares';
import { Account } from './entities';
import { AccountRepository } from './repositories';
import { ConfigToken, JWTToken } from './common/tokens';
import { Config } from './interfaces';

@Service()
export class Server {
  constructor(
    @InjectRepository(Account) private accountRepository: AccountRepository,
    @Inject(ConfigToken) private config: Config,
    @Inject(JWTToken) private jwt: JWTToken
  ) {}

  public async init() {
    useContainer(Container);

    const app = createExpressServer({
      authorizationChecker: this.authorizationChecker,
      currentUserChecker: this.currentUserChecker,
      cors: true,
      defaultErrorHandler: false,
      controllers: [__dirname + '/controllers/*.controller.ts'],
      middlewares: [CustomErrorHandlerMiddleware]
    });

    app.use(morgan('common'));

    return app.listen(this.config.server.port);
  }

  /**
   * TODO: Find better place for those methods
   */
  private authorizationChecker = async (action: Action, roles: string[]) => {
    const token = this.getTokenFromHeader(action);
    if (!token) return false;

    // Verify token
    this.jwt.verify(token, this.config.jwt.secret);

    if (!token) return false;
    const account = await this.accountRepository.findOne({ token: token }, { relations: ['roles'] });

    // If account was found but token has to be refreshed
    if (account && account.tokenRefreshRequired) return false;

    // If account was found and there are no roles specified - authorize successfuly
    if (account && !roles.length) return true;

    // If account was found and has specified role assigned - authorize successfulyy
    if (account && account.roles.find(role => roles.includes(role.name))) return true;

    // Otherwise deny access
    return false;
  };

  private currentUserChecker = async (action: Action) => {
    const token = this.getTokenFromHeader(action);
    if (!token) return false;

    return await this.accountRepository.findOne({ token: token }, { relations: ['roles'] });
  };

  private getTokenFromHeader = (action: Action) => {
    const authHeader = action.request.headers['authorization'];

    // Check if correct header exists
    if (!authHeader || authHeader.indexOf('Bearer') === -1) return false;

    // Check if token exists
    const token: string | undefined = authHeader.split(' ')[1];

    if (!token) return false;

    return token;
  };
}
