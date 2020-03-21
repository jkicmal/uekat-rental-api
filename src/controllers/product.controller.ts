import { JsonController, Get, Post, Body, Put, Param, Delete, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';

import { ProductFormData } from '../common/interfaces';
import { ProductService } from '../services';
import { Product } from '../entities';

class ResourceQueryParams {
  skip?: string;
  take?: string;
  relations?: string;
  order?: string;
}

class ResourceQueryParamsBuilder<T> {
  public skip: number;
  public take: number;
  public relations: Array<string>;
  public order: { [key in keyof T]: number };

  constructor(public resourceQueryParams: ResourceQueryParams) {}
}

@Service()
@JsonController()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/api/v1/products')
  public async getAll(@QueryParams() resourceQueryParams: ResourceQueryParams) {
    // TODO: Does it makes sense?
    const resourceQueryParamsBuilder = new ResourceQueryParamsBuilder<Product>(resourceQueryParams);
    resourceQueryParamsBuilder.order.category = 1;

    return this.productService.getAll();
  }

  @Get('/api/v1/products/:id')
  public async getOne(@Param('id') id: number) {
    return this.productService.getOne(id);
  }

  @Post('/api/v1/products')
  public async create(@Body() productFormData: ProductFormData) {
    return this.productService.create(productFormData);
  }

  @Put('/api/v1/products/:id')
  public async update(@Param('id') id: number, @Body() productFormData: ProductFormData) {
    return this.productService.update(id, productFormData);
  }

  @Delete('/api/v1/products/:id')
  public async delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}
