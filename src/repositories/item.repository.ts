import { Service } from 'typedi';
import { Repository, EntityRepository } from 'typeorm';
import { Item } from '../entities';

@Service()
@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {}
