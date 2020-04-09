import { Service } from 'typedi';
import { ResourceQueryParams } from '../common/helpers';
import { Account } from '../entities';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AccountRepository } from '../repositories';

@Service()
class AccountService {
  constructor(@InjectRepository(Account) private accountRepository: AccountRepository) {}

  public async getAll(resourceQueryParams: ResourceQueryParams<Account>) {
    return await this.accountRepository.find(resourceQueryParams);
  }

  public async getOne(id: number, resourceQueryParams: ResourceQueryParams<Account>) {
    return await this.accountRepository.findOne(id, resourceQueryParams);
  }
}

export default AccountService;
