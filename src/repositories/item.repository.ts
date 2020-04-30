import { Service } from 'typedi';
import { Repository, EntityRepository } from 'typeorm';
import { Item } from '../entities';

@Service()
@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
  async setItemsAvailability(items: Item[], available: boolean) {
    const itemsWithAvailabilitySet = items.map(item => ({ ...item, available }));
    return this.save(itemsWithAvailabilitySet);
  }
}
