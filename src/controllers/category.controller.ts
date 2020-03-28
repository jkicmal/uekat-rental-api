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

import { CategoryFormData } from '../common/interfaces';
import { CategoryService } from '../services';
import { ResourceQueryParamsBuilder } from '../common/helpers';
import { Category } from '../entities';
import { ResourceQueryPathParams } from '../common/helpers';
import { AccountType } from '../common/enums';

@Service()
@JsonController()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  /**
   * Common routes
   */
  @Get('/api/v1/categories')
  public async getAll(@QueryParams() resourceQueryPathParams: ResourceQueryPathParams) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Category>(resourceQueryPathParams)
      .applyOrder()
      .applyRelations(['products']).resourceQueryParams;

    return this.categoryService.getAll(resourceQueryParams);
  }

  /**
   * Employee routes
   */
  @Authorized(AccountType.EMPLOYEE)
  @Get('/api/v1/employee/categories')
  public async employeeGetAll(@QueryParams() resourceQueryPathParams: ResourceQueryPathParams) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Category>(resourceQueryPathParams)
      .applyOrder()
      .applyRelations(['products']).resourceQueryParams;

    return this.categoryService.getAll(resourceQueryParams);
  }

  @Authorized(AccountType.EMPLOYEE)
  @Get('/api/v1/employee/categories/:id')
  public async employeeGetOne(
    @Param('id') id: number,
    @QueryParams() resourceQueryPathParams: ResourceQueryPathParams
  ) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Category>(resourceQueryPathParams)
      .applyOrder()
      .applyRelations(['products']).resourceQueryParams;

    return this.categoryService.getOne(id, resourceQueryParams);
  }

  @Authorized(AccountType.EMPLOYEE)
  @Post('/api/v1/employee/categories')
  public async employeeCreate(@Body() categoryFormData: CategoryFormData) {
    return this.categoryService.create(categoryFormData);
  }

  @Authorized(AccountType.EMPLOYEE)
  @Put('/api/v1/employee/categories/:id')
  public async employeeUpdate(@Param('id') id: number, @Body() categoryFormData: CategoryFormData) {
    return this.categoryService.update(id, categoryFormData);
  }

  @Authorized(AccountType.EMPLOYEE)
  @Delete('/api/v1/employee/categories/:id')
  public async employeeDelete(@Param('id') id: number) {
    return this.categoryService.delete(id);
  }
}
