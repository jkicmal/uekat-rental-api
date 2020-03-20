import { Service } from 'typedi';
import { Repository, EntityRepository } from 'typeorm';
import { Account } from '../entities';

@Service()
@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {}
