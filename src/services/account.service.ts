import { Service } from 'typedi';
import { ResourceQueryParams } from '../common/helpers';
import { Account } from '../entities';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { AccountRepository } from '../repositories';
import { AccountEditFormData } from '../common/interfaces';
import { NotFoundError } from '../common/errors';

@Service()
class AccountService {
  constructor(@InjectRepository(Account) private accountRepository: AccountRepository) {}

  public async getAll(resourceQueryParams: ResourceQueryParams<Account>) {
    return await this.accountRepository.find(resourceQueryParams);
  }

  public async getOne(id: number, resourceQueryParams: ResourceQueryParams<Account>) {
    const account = await this.accountRepository.findOne(id, resourceQueryParams);

    if (!account) throw new NotFoundError('Account not found');

    return account;
  }

  public async updateOne(id: number, accountEditFormData: AccountEditFormData) {
    const account = await this.accountRepository.findOne(id);

    if (!account) throw new NotFoundError('Account not found');

    account.type = accountEditFormData.type;
    await this.accountRepository.save(account);

    return account;
  }
}

export default AccountService;
