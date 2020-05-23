import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Action } from 'routing-controllers';
import { AccountRepository } from '../../repositories';
import { Account } from '../../entities';
import { ConfigToken, JWTToken } from '../tokens';
import { Config } from '../interfaces';

@Service()
export class RoutingControllerUtils {
  constructor(
    @InjectRepository(Account) private accountRepository: AccountRepository,
    @Inject(ConfigToken) private config: Config,
    @Inject(JWTToken) private jwt: JWTToken
  ) {}

  /**
   * True - allow access to the resource
   * False - deny access to the resource
   */
  public async authorizationChecker(action: Action, accountTypes: string[]) {
    const authHeader = action.request.headers['authorization']; // Zapisanie wartości nagłówka do zmiennej
    if (!authHeader) return false; // Sprawdzenie czy nagłówek istnieje
    const token = this.getTokenFromHeader(authHeader); // Pobranie tokenu z nagłówka
    if (!token) return false; // Sprawdzenie czy pobrany token istnieje
    this.jwt.verify(token, this.config.jwt.secret); // Weryfikacja tokenu
    // Pobranie użytkownika dla którego token został wcześniej wygenerowany
    const account = await this.accountRepository.findOne({ token: token });
    // Sprawdzenie czy użytkownik wymaga ponownego logowania
    if (account && account.tokenRefreshRequired) return false;
    // Sprawdzenie czy typ użytkownika pasuje do typu zdefiniowanego w kontrolerze
    if (account && accountTypes.some(accountType => accountType === account.type)) return true;
    return false;
  }

  /**
   * Allow usage of CurrentUser decorator in routing controllers
   */
  public async currentUserChecker(action: Action) {
    const authHeader = action.request.headers['authorization'];
    const token = this.getTokenFromHeader(authHeader);

    if (!token) return false;

    return await this.accountRepository.findOne({ token: token });
  }

  private getTokenFromHeader(authHeader: string) {
    const [bearerString, token] = authHeader.split(' ');

    if (!bearerString || bearerString !== 'Bearer') return false;

    if (!token) return false;

    return token;
  }
}
