import { Service } from 'typedi';
import { ResourceQueryParams } from '../common/helpers';
import { Account } from '../entities';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AccountRepository } from '../repositories';

@Service()
class AccountService {
  constructor(@InjectRepository(Account) private accountRepository: AccountRepository) {}

  public async getAll(resourceQueryParams: ResourceQueryParams<Account>) {
    const accounts = await this.accountRepository.find(resourceQueryParams);
    return { data: accounts };
  }
}

export default AccountService;
