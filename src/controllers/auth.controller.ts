import { Post, Body, JsonController, CurrentUser, Authorized, OnUndefined, Get } from 'routing-controllers';
import { Service } from 'typedi';
import { AccountRegisterFormData, AccountLoginFormData } from '../common/interfaces';
import { StatusCode } from '../common/enums';
import { Account } from '../entities';
import { AuthService } from '../services';

@Service()
@JsonController()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/api/v1/register')
  async register(@Body() accountRegisterFormData: AccountRegisterFormData) {
    return this.authService.register(accountRegisterFormData);
  }

  @Post('/api/v1/login')
  async login(@Body() accountLoginFormData: AccountLoginFormData) {
    return this.authService.login(accountLoginFormData);
  }

  @Authorized()
  @Post('/api/v1/logout')
  @OnUndefined(StatusCode.NO_CONTENT)
  public async logout(@CurrentUser({ required: true }) account: Account) {
    return this.authService.logout(account);
  }

  @Authorized()
  @Get('/api/v1/profile')
  public async getProfile(@CurrentUser({ required: true }) account: Account) {
    return account;
  }
}
