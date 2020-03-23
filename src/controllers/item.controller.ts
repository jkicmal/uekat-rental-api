import { JsonController, Get, Post, Body, Put, Param, Delete, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';

import { ItemFormData } from '../common/interfaces';
import { ItemService } from '../services';
import { Item } from '../entities';
import { ResourceQueryPathParams, ResourceQueryParamsBuilder } from '../common/helpers';

@Service()
@JsonController()
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get('/api/v1/items')
  public async getAll(@QueryParams() resourceQueryPathParams: ResourceQueryPathParams) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Item>(resourceQueryPathParams)
      .applyOrder()
      .applyRelations(['product', 'owner'])
      .applyPagination().resourceQueryParams;

    return this.itemService.getAll(resourceQueryParams);
  }

  @Get('/api/v1/items/:id')
  public async getOne(
    @Param('id') id: number,
    @QueryParams() resourceQueryPathParams: ResourceQueryPathParams
  ) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Item>(resourceQueryPathParams).applyRelations([
      'product',
      'owner'
    ]).resourceQueryParams;

    return this.itemService.getOne(id, resourceQueryParams);
  }

  @Post('/api/v1/items')
  public async create(@Body() itemFormData: ItemFormData) {
    return this.itemService.create(itemFormData);
  }

  @Put('/api/v1/items/:id')
  public async update(@Param('id') id: number, @Body() itemFormData: ItemFormData) {
    return this.itemService.update(id, itemFormData);
  }

  @Delete('/api/v1/items/:id')
  public async delete(@Param('id') id: number) {
    return this.itemService.delete(id);
  }
}
