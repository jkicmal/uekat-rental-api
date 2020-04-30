import { Service } from 'typedi';
import { Repository, EntityRepository } from 'typeorm';
import { Account } from '../entities';
import { AccountType } from '../common/enums';

@Service()
@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
  public getEmployeesThatReceiveEmails() {
    return this.find({ where: { receiveEmails: true, type: AccountType.EMPLOYEE } });
  }
}
