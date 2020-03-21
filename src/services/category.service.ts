import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { CategoryRepository } from '../repositories';
import { CategoryFormData } from '../common/interfaces';
import { NotFoundError } from '../common/errors/';

@Service()
class CategoryService {
  constructor(@InjectRepository() private categoryRepository: CategoryRepository) {}

  public async getAll() {
    const categories = await this.categoryRepository.find();
    return { data: categories };
  }

  public async getOne(id: number) {
    const category = await this.categoryRepository.findOne(id);
    if (!category) throw new NotFoundError('Category not found');
    return { data: category };
  }

  public async create(categoryFormData: CategoryFormData) {
    const categoryToCreate = this.categoryRepository.create(categoryFormData);
    const createdCategory = await this.categoryRepository.save(categoryToCreate);
    return { data: createdCategory };
  }

  public async update(id: number, categoryFormData: CategoryFormData) {
    const categoryToUpdate = await this.categoryRepository.findOne(id);
    if (!categoryToUpdate) throw new NotFoundError('Category not found');
    const updatedCategory = await this.categoryRepository.save({ id: id, ...categoryFormData });
    return { data: updatedCategory };
  }

  public async delete(id: number) {
    const categoryToDelete = await this.categoryRepository.findOne(id);
    if (!categoryToDelete) throw new NotFoundError('Category not found');
    const deletedCategory = await this.categoryRepository.remove(categoryToDelete);
    return { data: { id, ...deletedCategory } };
  }
}

export default CategoryService;
