import { Service } from 'typedi';
import { Action } from 'routing-controllers';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AccountRepository } from '../repositories';
import { Account } from '../entities';

@Service()
export class AuthorizationCheckerMiddleware {
  /** FIXME: When using this as a service in server.ts, problem is with injecting repository
   TypeError: Cannot read property 'findOne' of undefined
    at ExpressDriver.<anonymous> (C:\Projects\rental-api\src\middlewares\authorization-checker.middleware.ts:16:50)
    at step (C:\Projects\rental-api\src\middlewares\authorization-checker.middleware.ts:45:23)
    at Object.next (C:\Projects\rental-api\src\middlewares\authorization-checker.middleware.ts:26:53)
    at C:\Projects\rental-api\src\middlewares\authorization-checker.middleware.ts:20:71
    at new Promise (<anonymous>)
    at __awaiter (C:\Projects\rental-api\src\middlewares\authorization-checker.middleware.ts:16:12)
    at ExpressDriver.AuthorizationCheckerMiddleware.use [as authorizationChecker] (C:\Projects\rental-api\src\middlewares\authorization-checker.middleware.ts:60:16)
    at C:\Projects\src\driver\express\ExpressDriver.ts:117:46
    at Layer.handle [as handle_request] (C:\Projects\rental-api\node_modules\express\lib\router\layer.js:95:5)
    at next (C:\Projects\rental-api\node_modules\express\lib\router\route.js:137:13)
   */
  constructor(@InjectRepository(Account) private accountRepository: AccountRepository) {}

  public async use(action: Action, roles: string[]) {
    const authHeader: string = action.request.headers['authorization'];
    if (!authHeader || authHeader.indexOf('Bearer') === -1) return false;
    const token = authHeader.split(' ')[1];
    if (!token) throw false;
    const account = await this.accountRepository.findOne({ token: token }, { relations: ['roles'] });
    if (account && !roles.length) return true;
    if (account && account.roles.find(role => roles.includes(role.name))) return true;
    return false;
  }
}
