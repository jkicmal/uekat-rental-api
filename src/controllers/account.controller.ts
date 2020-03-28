import { Get, JsonController, Authorized } from 'routing-controllers';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Account } from '../entities';
import { AccountRepository } from '../repositories';
import { AccountType } from '../common/enums';

@JsonController()
export class AccountsController {
  constructor(@InjectRepository(Account) private accountRepository: AccountRepository) {}

  @Get('/api/v1/employee/accounts')
  @Authorized(AccountType.EMPLOYEE)
  async getAll() {
    return this.accountRepository.find();
  }
}
