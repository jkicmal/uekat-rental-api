import { JsonController, Get, Param } from 'routing-controllers';
import { Service } from 'typedi';
import { StoreService } from '../services';

@Service()
@JsonController()
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Get('/api/v1/store')
  async getStoreProducts() {
    const data = await this.storeService.getStoreData();
    return { data };
  }

  @Get('/api/v1/store/products/:id')
  async getStoreProduct(@Param('id') id: number) {
    const data = await this.storeService.getStoreProduct(id);
    return { data };
  }
}
