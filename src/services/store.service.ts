import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { CategoryRepository } from '../repositories';
import { Category } from '../entities';

@Service()
class StoreService {
  constructor(@InjectRepository(Category) private categoryRepository: CategoryRepository) {}

  public getStoreData() {
    return this.categoryRepository.getCategoriesWithProducts();
  }
}

export default StoreService;
