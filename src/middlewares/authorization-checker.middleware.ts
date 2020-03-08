import Container, { Service } from 'typedi';
import { Action } from 'routing-controllers';
import { AccountRepository } from '../repositories';

@Service()
export class AuthorizationCheckerMiddleware {
  public async use(action: Action, roles: string[]) {
    const accountRepository = Container.get(AccountRepository);

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
  }
}
