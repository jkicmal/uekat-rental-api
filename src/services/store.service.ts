import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { CategoryRepository } from '../repositories';
import { Category } from '../entities';
import { getConnection } from 'typeorm';
import { NotFoundError } from '../common/errors';

@Service()
class StoreService {
  constructor(@InjectRepository(Category) private categoryRepository: CategoryRepository) {}

  public getStoreData() {
    return this.categoryRepository.getCategoriesWithProducts();
  }

  public async getStoreProduct(id: number) {
    const results = await getConnection().query(
      `
      SELECT 
          p1."id" as id, 
          p1."name" as name,
          p1."description" as description,
          p1."price" as price,
          p1."deposit" as deposit,
          (
          select row_to_json(categoryRow)
          from (
            select c2.id , c2."name" 
            from category c2 
            where c2."id" = p1."categoryId" 
          ) categoryRow
          ) as "category",
          (
            SELECT count(i2.id)
            FROM item i2 where i2."productId" = p1.id 
          ) as "totalItemsCount",
          (
            SELECT count(i2.id)
            FROM item i2 where i2."productId" = p1.id and i2.available = true 
          ) as "availableItemsCount"
      FROM "product" p1
      WHERE 
          p1."id" = $1
          AND p1."showInStore" = true
    `,
      [id]
    );

    const product = results[0];

    if (!product) throw new NotFoundError('Product not found');

    return product;
  }
}

export default StoreService;
