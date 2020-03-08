import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Action } from 'routing-controllers';
import { AccountRepository } from '../../repositories';
import { Account } from '../../entities';
import { ConfigToken, JWTToken } from '../tokens';
import { Config } from '../../interfaces';

@Service()
export class RoutingControllerUtils {
  constructor(
    @InjectRepository(Account) private accountRepository: AccountRepository,
    @Inject(ConfigToken) private config: Config,
    @Inject(JWTToken) private jwt: JWTToken
  ) {}

  /**
   * Those functions have to be declared as properties, not methods
   * otherwise when setting checkers in config will use wrong 'this' object
   */

  /**
   * True - allow access to the resource
   * False - deny access to the resource
   */
  public authorizationChecker = async (action: Action, roles: string[]) => {
    const authHeader = action.request.headers['authorization'];
    const token = this.getTokenFromHeader(authHeader);

    if (!token) return false;

    // Verify token
    this.jwt.verify(token, this.config.jwt.secret);

    // Fetch account
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

  /**
   * Allow usage of CurrentUser decorator in routing controllers
   */
  public currentUserChecker = async (action: Action) => {
    const authHeader = action.request.headers['authorization'];
    const token = this.getTokenFromHeader(authHeader);

    if (!token) return false;

    return await this.accountRepository.findOne({ token: token }, { relations: ['roles'] });
  };

  private getTokenFromHeader = (authHeader: string) => {
    const [bearerString, token] = authHeader.split(' ');

    if (!bearerString || bearerString !== 'Bearer') return false;

    if (!token) return false;

    return token;
  };
}
