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

import { ItemFormData } from '../common/interfaces';
import { ItemService } from '../services';
import { Item } from '../entities';
import { ResourceQueryPathParams, ResourceQueryParamsBuilder } from '../common/helpers';
import { AccountType } from '../common/enums';

@Service()
@JsonController()
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Authorized(AccountType.EMPLOYEE)
  @Get('/api/v1/employee/items')
  public async employeeGetAll(@QueryParams() resourceQueryPathParams: ResourceQueryPathParams) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Item>(resourceQueryPathParams)
      .applyOrder()
      .applyRelations(['product', 'owner'])
      .applyWhere()
      .applyPagination().resourceQueryParams;

    return this.itemService.getAll(resourceQueryParams);
  }

  @Authorized(AccountType.EMPLOYEE)
  @Get('/api/v1/employee/items/:id')
  public async employeeGetOne(
    @Param('id') id: number,
    @QueryParams() resourceQueryPathParams: ResourceQueryPathParams
  ) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Item>(resourceQueryPathParams).applyRelations([
      'product',
      'owner'
    ]).resourceQueryParams;

    return this.itemService.getOne(id, resourceQueryParams);
  }

  @Authorized(AccountType.EMPLOYEE)
  @Post('/api/v1/employee/items')
  public async employeeCreate(@Body() itemFormData: ItemFormData) {
    return this.itemService.create(itemFormData);
  }

  @Authorized(AccountType.EMPLOYEE)
  @Put('/api/v1/employee/items/:id')
  public async employeeUpdate(@Param('id') id: number, @Body() itemFormData: ItemFormData) {
    return this.itemService.update(id, itemFormData);
  }

  @Authorized(AccountType.EMPLOYEE)
  @Delete('/api/v1/employee/items/:id')
  public async employeeDelete(@Param('id') id: number) {
    return this.itemService.delete(id);
  }
}
