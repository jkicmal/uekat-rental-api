import { Service } from 'typedi';
import { AbstractRepository } from 'typeorm';
import { Account } from '../database/entities';

@Service()
export class AccountRepository<Account> extends AbstractRepository<Account> {}
