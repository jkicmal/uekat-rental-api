import { JsonController, Get, Post, Body, Put, Param, Delete } from 'routing-controllers';
import { Service } from 'typedi';

import { CategoryFormData } from '../common/interfaces';
import { CategoryService } from '../services';

@Service()
@JsonController()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/api/v1/categories')
  public async getAll() {
    return this.categoryService.getAll();
  }

  @Get('/api/v1/categories/:id')
  public async getOne(@Param('id') id: number) {
    return this.categoryService.getOne(id);
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
