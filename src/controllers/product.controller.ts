import { JsonController, Get, Post, Body, Put, Param, Delete, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';

import { ProductFormData } from '../common/interfaces';
import { ProductService } from '../services';
import { Product } from '../entities';
import { ResourceQueryPathParams, ResourceQueryParamsBuilder } from '../common/helpers';

@Service()
@JsonController()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/api/v1/products')
  public async getAll(@QueryParams() resourceQueryPathParams: ResourceQueryPathParams) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Product>(resourceQueryPathParams)
      .applyOrder()
      .applyRelations(['category'])
      .applyPagination().resourceQueryParams;

    return this.productService.getAll(resourceQueryParams);
  }

  @Get('/api/v1/products/:id')
  public async getOne(
    @Param('id') id: number,
    @QueryParams() resourceQueryPathParams: ResourceQueryPathParams
  ) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Product>(
      resourceQueryPathParams
    ).applyRelations(['category']).resourceQueryParams;

    return this.productService.getOne(id, resourceQueryParams);
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
