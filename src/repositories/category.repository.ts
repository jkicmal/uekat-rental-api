import { Service } from 'typedi';
import { Repository, EntityRepository } from 'typeorm';
import { Category } from '../entities';
import { CategoryPayload } from '../common/request-payloads';

@Service()
@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {}
