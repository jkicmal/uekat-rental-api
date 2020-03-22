import { JsonController, Get, Post, Body, Put, Param, Delete, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';

import { CategoryFormData } from '../common/interfaces';
import { CategoryService } from '../services';
import { ResourceQueryParamsBuilder } from '../common/helpers';
import { Category } from '../entities';
import { ResourceQueryPathParams } from '../common/helpers';

@Service()
@JsonController()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/api/v1/categories')
  public async getAll(@QueryParams() resourceQueryPathParams: ResourceQueryPathParams) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Category>(resourceQueryPathParams)
      .applyOrder()
      .applyRelations(['products']).resourceQueryParams;

    return this.categoryService.getAll(resourceQueryParams);
  }

  @Get('/api/v1/categories/:id')
  public async getOne(
    @Param('id') id: number,
    @QueryParams() resourceQueryPathParams: ResourceQueryPathParams
  ) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Category>(resourceQueryPathParams)
      .applyOrder()
      .applyRelations(['products']).resourceQueryParams;

    return this.categoryService.getOne(id, resourceQueryParams);
  }

  @Post('/api/v1/categories')
  public async create(@Body() categoryFormData: CategoryFormData) {
    return this.categoryService.create(categoryFormData);
  }

  @Put('/api/v1/categories/:id')
  public async update(@Param('id') id: number, @Body() categoryFormData: CategoryFormData) {
    return this.categoryService.update(id, categoryFormData);
  }

  @Delete('/api/v1/categories/:id')
  public async delete(@Param('id') id: number) {
    return this.categoryService.delete(id);
  }
}
