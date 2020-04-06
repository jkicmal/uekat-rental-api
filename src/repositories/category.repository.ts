import { Service } from 'typedi';
import { Repository, EntityRepository, getConnection } from 'typeorm';
import { Category } from '../entities';

@Service()
@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
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
                            p2."description" as description,
                            p2."price" as price,
                            p2."deposit" as deposit,
                            c1."name" as "categoryName",
                            (
                            SELECT count(i3.id)
                            FROM item i3 where i3."productId" = p2.id 
                            ) as "totalItemsCount",
                            (
                            SELECT count(i3.id)
                            FROM item i3 where i3."productId" = p2.id and i3.available = true 
                            ) as "availableItemsCount"
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
            GROUP BY
                c1."id"
        `);

    return categoriesWithProducts;
  }
}
