import { Get, JsonController } from 'routing-controllers';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Account } from '../entities';
import { AccountRepository } from '../repositories';

@JsonController()
export class AccountsController {
  constructor(@InjectRepository(Account) private accountRepository: AccountRepository) {}

  @Get('/api/v1/accounts')
  async getAll() {
    return this.accountRepository.find({ relations: ['roles'] });
  }
}
