import { Service } from 'typedi';
import { Repository, EntityRepository } from 'typeorm';
import { Category } from '../entities';

@Service()
@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {}
