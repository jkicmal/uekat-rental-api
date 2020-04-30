import { Service, Inject } from 'typedi';
import { AccountRepository } from '../repositories';
import { validateAndGetFirstValidationError } from '../common/helpers';
import { AccountRegisterFormData, AccountLoginFormData, Config } from '../common/interfaces';
import { Account } from '../entities';
import { ValidationError, DatabaseError } from '../common/errors';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ConfigToken } from '../common/tokens';

@Service()
class AuthService {
  constructor(
    @InjectRepository() private accountRepository: AccountRepository,
    @Inject(ConfigToken) private config: Config
  ) {}

  public async register(accountRegisterFormData: AccountRegisterFormData) {
    const account = this.accountRepository.create(accountRegisterFormData);

    // FIXME:
    // This should return all validation errors, not only 1
    const validationError = await validateAndGetFirstValidationError(account);
    if (validationError) throw validationError;

    const { password, passwordRepeat, email } = accountRegisterFormData;
    if (password != passwordRepeat) throw new ValidationError(`Passwords don't match`);

    const existingAccountWithGivenEmail = await this.accountRepository.findOne({ email });
    if (existingAccountWithGivenEmail) throw new ValidationError(`${email} is already taken`);

    const registeredAccount = await this.accountRepository.save(account);

    return registeredAccount;
  }

  public async logout(account: Account) {
    account.token = null;
    account.tokenRefreshRequired = true;
    try {
      await this.accountRepository.save(account);
    } catch (err) {
      throw new DatabaseError(`Error occured while logging out`, err);
    }
  }

  public async login(accountLoginFormData: AccountLoginFormData) {
    const { password, email } = accountLoginFormData;

    /**
     * Get account from database
     */
    let account: Account | undefined;
    try {
      account = await this.accountRepository.findOne({ email: email });
    } catch (err) {
      throw new DatabaseError(`Error occured while searching for account`, err);
    }
    if (!account) throw new ValidationError(`Email or password invalid`);

    /**
     * Validate password
     */
    const passwordCheck = await account.validatePassword(password);
    if (!passwordCheck) throw new ValidationError(`Email or password invalid`);

    /**
     * Generate and save token
     */
    account.generateToken();
    account.tokenRefreshRequired = false;
    await this.accountRepository.save(account);

    return {
      data: { token: account.token, expiresIn: this.config.jwt.expiresIn, accountType: account.type }
    };
  }
}

export default AuthService;
