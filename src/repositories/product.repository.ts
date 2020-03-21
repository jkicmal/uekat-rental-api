import { Service } from 'typedi';
import { Repository, EntityRepository } from 'typeorm';
import { Product } from '../entities';

@Service()
@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {}
