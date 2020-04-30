import { Service } from 'typedi';
import { Repository, EntityRepository } from 'typeorm';
import { Product } from '../entities';

@Service()
@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  findProductsAvailableForRental(productsIds: number[]) {
    return this.createQueryBuilder('product')
      .innerJoinAndSelect('product.items', 'item')
      .innerJoinAndSelect('product.category', 'category')
      .whereInIds(productsIds)
      .andWhere('item.available = true')
      .getMany();
  }
}
