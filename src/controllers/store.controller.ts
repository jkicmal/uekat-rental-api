import { JsonController, Get } from 'routing-controllers';
import { Service } from 'typedi';
import { StoreService } from '../services';

@Service()
@JsonController()
export class StoreController {
  constructor(private storeService: StoreService) {}
  @Get('/api/v1/store')
  async store() {
    const categoriesWithProducts = await this.storeService.getCategoriesWithProducts();
    return { data: categoriesWithProducts };
  }
}
