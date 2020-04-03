import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { CategoryRepository, ProductRepository, ItemRepository } from '../repositories';
import { Category, Product, Item } from '../entities';
import { getConnection } from 'typeorm';

@Service()
class StoreService {
  constructor(
    @InjectRepository(Category) private categoryRepository: CategoryRepository,
    @InjectRepository(Product) private productRepository: ProductRepository,
    @InjectRepository(Item) private itemRepository: ItemRepository
  ) {}

  public async getCategoriesWithProducts() {
    const categoriesWithProducts = await getConnection().query(`
        SELECT 
             c1."id",
             c1."name",
             (SELECT json_agg(item) 
                FROM (
                    SELECT 
                        p2."id" as id, 
                        p2."name" as name,
                        p2."showInStore" as showInStore
                    FROM "product" p2
                    WHERE 
                        p2."categoryId" = c1."id"
                        AND p2."showInStore" = true
                ) item
             ) as products
        FROM 
            "category" c1
            INNER JOIN "product" p1  ON p1."categoryId" = c1."id"
        WHERE
            p1."showInStore" = true
    `);

    return categoriesWithProducts;
  }
}

export default StoreService;
