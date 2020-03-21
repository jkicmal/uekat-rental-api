import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { CategoryRepository } from '../repositories';
import { CategoryFormData } from '../common/interfaces';

@Service()
class CategoryService {
  constructor(@InjectRepository() private categoryRepository: CategoryRepository) {}

  public async getAll() {
    const fetchedCategories = await this.categoryRepository.find();
    return { data: fetchedCategories };
  }

  public async getOne(id: number) {
    const fetchedCategory = await this.categoryRepository.findOne(id);
    return { data: fetchedCategory };
  }

  public async create(categoryFormData: CategoryFormData) {
    const newCategory = this.categoryRepository.create(categoryFormData);
    const createdCategory = await this.categoryRepository.save(newCategory);
    return { data: createdCategory };
  }

  public async update(id: number, categoryFormData: CategoryFormData) {
    const exisitngCategory = await this.categoryRepository.findOne(id);
    if (exisitngCategory) {
      const updatedCategory = await this.categoryRepository.save({ id: id, ...categoryFormData });
      return { data: updatedCategory };
    }
  }

  public async delete(id: number) {
    const existingCategory = await this.categoryRepository.findOne(id);
    if (existingCategory) {
      const deletedCategory = await this.categoryRepository.remove(existingCategory);
      return { data: { ...deletedCategory, id: id } };
    }
  }
}

export default CategoryService;
