import { Service } from 'typedi';
import { Repository, EntityRepository } from 'typeorm';
import { Role } from '../entities';

@Service()
@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {}
