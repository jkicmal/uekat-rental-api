import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { ItemRepository } from '../repositories';
import { ItemFormData } from '../common/interfaces';
import { NotFoundError } from '../common/errors';
import { Item } from '../entities';
import { ResourceQueryParams } from '../common/helpers';

@Service()
class ItemService {
  constructor(@InjectRepository() private itemRepository: ItemRepository) {}

  public async getAll(resourceQueryParams: ResourceQueryParams<Item>) {
    const items = await this.itemRepository.find(resourceQueryParams);
    return { data: items };
  }

  public async getOne(id: number, resourceQueryParams: ResourceQueryParams<Item>) {
    const item = await this.itemRepository.findOne({ id }, resourceQueryParams);
    if (!item) throw new NotFoundError('Item not found');
    return { data: item };
  }

  public async create(itemFormData: ItemFormData) {
    const itemToCreate = this.itemRepository.create(itemFormData);
    const createdItem = await this.itemRepository.save(itemToCreate);
    return { data: createdItem };
  }

  public async update(id: number, itemFormData: ItemFormData) {
    const itemToUpdate = await this.itemRepository.findOne({ id });
    if (!itemToUpdate) throw new NotFoundError('Item not found');
    const updatedFields = await this.itemRepository.save({ id, ...itemFormData });
    return { data: { ...itemToUpdate, ...updatedFields } };
  }

  public async delete(id: number) {
    const itemToDelete = await this.itemRepository.findOne({ id });
    if (!itemToDelete) throw new NotFoundError('Item not found');
    const deletedItem = await this.itemRepository.remove(itemToDelete);
    return { data: { ...deletedItem, id } };
  }
}

export default ItemService;
