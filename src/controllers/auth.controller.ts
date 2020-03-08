import { Post, Body, JsonController } from 'routing-controllers';
import { AccountRepository } from '../repositories';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AccountRegistrationDto, AccountLoginDto } from '../interfaces';
import { AccountType } from '../enums';
import { ValidationError, DatabaseError } from '../errors';
import { validate } from 'class-validator';
import { Role, Account } from '../entities';

@Service()
@JsonController()
export class AuthController {
  constructor(@InjectRepository() private accountRepository: AccountRepository) {}

  @Post('/api/v1/register')
  async register(@Body() accountRegistrationDto: AccountRegistrationDto) {
    const account = this.accountRepository.create(accountRegistrationDto);

    account.type = AccountType.CUSTOMER;

    if (accountRegistrationDto.password1 != accountRegistrationDto.password2) {
      throw new ValidationError(`Passwords don't match`);
    }

    account.password = accountRegistrationDto.password1;

    validate(account);

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
    await this.accountRepository.save(account);

    return { data: { token: account.token } };
  }
}
