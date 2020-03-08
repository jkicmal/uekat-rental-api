import { JsonController, Get } from 'routing-controllers';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Account, Role } from '../entities';
import { AccountRepository, RoleRepository } from '../repositories';

@Service()
@JsonController()
export class SandboxController {
  constructor(
    @InjectRepository(Account) private accountRepository: AccountRepository,
    @InjectRepository(Role) private roleRepository: RoleRepository
  ) {
    //
  }

  @Get('/sandbox')
  async run() {
    console.log('RUNNING SANDBOX');

    const adminRole = await this.roleRepository.findOne({ name: 'Administrator' });
    const johnsAccount = await this.accountRepository.findOne({ email: 'john.doe@gmail.com' });

    if (adminRole && johnsAccount) {
      johnsAccount.roles = [adminRole];
      return await this.accountRepository.save(johnsAccount);
    }

    return '';
  }
}
