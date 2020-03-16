import { JsonController, Get, Post, Body, Put, Param, Delete } from 'routing-controllers';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Service, Inject } from 'typedi';
import { LoggerToken, Logger } from '../common/tokens';
import { CategoryRepository } from '../repositories';
import { CategoryPayload } from '../common/request-payloads';

@Service()
@JsonController()
export class CategoryController {
  constructor(
    @InjectRepository() private categoryRepository: CategoryRepository,
    @Inject(LoggerToken) private logger: Logger
  ) {}

  @Get('/api/v1/categories')
  public async getAll() {
    const fetchedCategories = await this.categoryRepository.find();
    return { data: fetchedCategories };
  }

  @Get('/api/v1/categories/:id')
  public async getOne(@Param('id') id: number) {
    const fetchedCategory = await this.categoryRepository.findOne(id);
    return { data: fetchedCategory };
  }

  @Post('/api/v1/categories')
  public async create(@Body() categoryPayload: CategoryPayload) {
    const newCategory = this.categoryRepository.create(categoryPayload);
    const createdCategory = await this.categoryRepository.save(newCategory);
    return { data: createdCategory };
  }

  @Put('/api/v1/categories/:id')
  public async update(@Param('id') id: number, @Body() categoryPayload: CategoryPayload) {
    const exisitngCategory = await this.categoryRepository.findOne(id);
    if (exisitngCategory) {
      const updatedCategory = await this.categoryRepository.save({ id: id, ...categoryPayload });
      return { data: updatedCategory };
    }
  }

  @Delete('/api/v1/categories/:id')
  public async delete(@Param('id') id: number) {
    const existingCategory = await this.categoryRepository.findOne(id);
    if (existingCategory) {
      const deletedCategory = await this.categoryRepository.remove(existingCategory);
      return { data: { ...deletedCategory, id: id } };
    }
  }
}
