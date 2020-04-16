import {
  JsonController,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  QueryParams,
  Authorized
} from 'routing-controllers';
import { Service } from 'typedi';

import { ProductFormData } from '../common/interfaces';
import { ProductService } from '../services';
import { Product } from '../entities';
import { ResourceQueryPathParams, ResourceQueryParamsBuilder } from '../common/helpers';
import { AccountType } from '../common/enums';

@Service()
@JsonController()
export class ProductController {
  constructor(private productService: ProductService) {}

  // Employee
  @Authorized(AccountType.EMPLOYEE)
  @Get('/api/v1/employee/products')
  public async employeeGetMany(@QueryParams() resourceQueryPathParams: ResourceQueryPathParams) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Product>(resourceQueryPathParams)
      .applyOrder()
      .applyRelations(['category'])
      .applyPagination().resourceQueryParams;

    return this.productService.getAll(resourceQueryParams);
  }

  @Authorized(AccountType.EMPLOYEE)
  @Get('/api/v1/employee/products/:id')
  public async employeeGetOne(
    @Param('id') id: number,
    @QueryParams() resourceQueryPathParams: ResourceQueryPathParams
  ) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Product>(
      resourceQueryPathParams
    ).applyRelations(['category']).resourceQueryParams;

    return this.productService.getOne(id, resourceQueryParams);
  }

  @Authorized(AccountType.EMPLOYEE)
  @Post('/api/v1/employee/products')
  public async employeeCreate(@Body() productFormData: ProductFormData) {
    return this.productService.create(productFormData);
  }

  @Authorized(AccountType.EMPLOYEE)
  @Put('/api/v1/employee/products/:id')
  public async employeeUpdate(@Param('id') id: number, @Body() productFormData: ProductFormData) {
    return this.productService.update(id, productFormData);
  }

  @Authorized(AccountType.EMPLOYEE)
  @Delete('/api/v1/employee/products/:id')
  public async employeeDelete(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}
