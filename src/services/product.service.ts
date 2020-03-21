import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { ProductRepository } from '../repositories';
import { ProductFormData } from '../common/interfaces';
import { NotFoundError } from '../common/errors';

@Service()
class ProductService {
  constructor(@InjectRepository() private productRepository: ProductRepository) {}

  public async getAll() {
    const products = await this.productRepository.find({ relations: ['category'] });
    return { data: products };
  }

  public async getOne(id: number) {
    const product = await this.productRepository.findOne({ id }, { relations: ['category'] });
    if (!product) throw new NotFoundError('Product not found');
    return { data: product };
  }

  public async create(productFormData: ProductFormData) {
    const productToCreate = this.productRepository.create(productFormData);
    const createdProduct = await this.productRepository.save(productToCreate);
    return { data: createdProduct };
  }

  public async update(id: number, productFormData: ProductFormData) {
    const productToUpdate = await this.productRepository.findOne({ id });
    if (!productToUpdate) throw new NotFoundError('Product not found');
    const updatedProduct = await this.productRepository.save({ id, ...productFormData });
    return { data: updatedProduct };
  }

  public async delete(id: number) {
    const productToDelete = await this.productRepository.findOne({ id });
    if (!productToDelete) throw new NotFoundError('Product not found');
    const deletedProduct = await this.productRepository.remove(productToDelete);
    return { data: { id, ...deletedProduct } };
  }
}

export default ProductService;
