import { JsonController, Get } from 'routing-controllers';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Account } from '../entities';
import { AccountRepository } from '../repositories';

@Service()
@JsonController()
export class SandboxController {
  constructor(@InjectRepository(Account) private accountRepository: AccountRepository) {}

  @Get('/sandbox')
  async run() {
    console.log('[SANDBOX]');
  }
}
