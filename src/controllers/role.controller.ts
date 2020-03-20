import { Get, Post, JsonController, Body, Authorized } from 'routing-controllers';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Role } from '../entities';
import { RoleRepository } from '../repositories';
import { RoleDto } from '../common/interfaces';
import { DatabaseError } from '../common/errors';

@Service()
@JsonController()
export class AccountsController {
  constructor(@InjectRepository(Role) private roleRepository: RoleRepository) {}

  @Get('/api/v1/roles')
  @Authorized('Administrator')
  async getAll() {
    try {
      const roles = await this.roleRepository.find();
      return { data: roles };
    } catch (err) {
      throw new DatabaseError(`Couldn't get roles`, err);
    }
  }

  @Post('/api/v1/roles')
  @Authorized('Administrator')
  async create(@Body() roleDto: RoleDto) {
    const role = this.roleRepository.create(roleDto);

    try {
      const savedRole = await this.roleRepository.save(role);
      return { data: savedRole };
    } catch (err) {
      throw new DatabaseError(`Couldn't create role`, err);
    }
  }
}
