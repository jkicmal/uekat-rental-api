import { Post, Body, JsonController, CurrentUser, Authorized, OnUndefined, Get } from 'routing-controllers';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service, Inject } from 'typedi';
import { AccountRepository } from '../repositories';
import { AccountRegistrationDto, AccountLoginDto, Config } from '../common/interfaces';
import { StatusCode } from '../common/enums';
import { ValidationError, DatabaseError } from '../common/errors';
import { Account } from '../entities';
import { LoggerToken, Logger, ConfigToken } from '../common/tokens';
import { validateAndGetFirstValidationError } from '../common/helpers';

@Service()
@JsonController()
export class AuthController {
  constructor(
    @InjectRepository() private accountRepository: AccountRepository,
    @Inject(LoggerToken) private logger: Logger,
    @Inject(ConfigToken) private config: Config
  ) {}

  @Post('/api/v1/register')
  async register(@Body() accountRegistrationDto: AccountRegistrationDto) {
    const account = this.accountRepository.create(accountRegistrationDto);

    /**
     * FIXME:
     * This should return all validation errors
     */
    const validationError = await validateAndGetFirstValidationError(account);
    if (validationError) throw validationError;

    if (accountRegistrationDto.password != accountRegistrationDto.passwordRepeat) {
      throw new ValidationError(`Passwords don't match`);
    }

    const savedUser = await this.accountRepository.save(account);

    return savedUser;
  }

  @Post('/api/v1/login')
  async login(@Body() accountLoginDto: AccountLoginDto) {
    const { password, email } = accountLoginDto;

    /**
     * Get account from database
     */
    let account: Account | undefined;
    try {
      account = await this.accountRepository.findOne({ email: email }, { relations: ['roles'] });
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

    return { data: { token: account.token, expiresIn: this.config.jwt.expiresIn, accountType: account.type } };
  }

  @Authorized()
  @Post('/api/v1/logout')
  @OnUndefined(StatusCode.NO_CONTENT)
  public async logout(@CurrentUser({ required: true }) account: Account) {
    account.token = null;
    account.tokenRefreshRequired = true;
    try {
      await this.accountRepository.save(account);
    } catch (err) {
      throw new DatabaseError(`Error occured while logging out`, err);
    }
  }

  @Authorized()
  @Get('/api/v1/profile')
  public async getProfile(@CurrentUser({ required: true }) account: Account) {
    return account;
  }
}
