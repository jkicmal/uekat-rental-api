import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { RentalFormData } from '../common/interfaces';
import { RentalRepository, ProductRepository, ItemRepository } from '../repositories';
import { Rental, Account } from '../entities';
import { MomentToken, MomentInstance } from '../common/tokens';
import { NotFoundError, ValidationError } from '../common/errors';

@Service()
class RentalService {
  constructor(
    @InjectRepository() private rentalRepository: RentalRepository,
    @InjectRepository() private productRepository: ProductRepository,
    @InjectRepository() private itemRepository: ItemRepository,
    @Inject(MomentToken) private moment: MomentInstance
  ) {}

  public async create(customer: Account, rentalFormData: RentalFormData) {
    const productsToRent = await this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndSelect('product.items', 'item')
      .innerJoinAndSelect('product.category', 'category')
      .whereInIds(rentalFormData.productsIds)
      .andWhere('item.available = true')
      .getMany();

    if (!productsToRent.length) throw new NotFoundError('One of requested products is unavailable');

    const itemsForRent = productsToRent.map(product => {
      const item = product.items[0];
      item.available = false;
      return item;
    });

    await this.itemRepository.save(itemsForRent);

    const rental = new Rental();
    rental.requestedBy = customer;
    rental.requestedProducts = productsToRent;
    rental.items = itemsForRent;
    rental.endDate = this.moment(rentalFormData.endDate).toDate();
    rental.startDate = this.moment(rentalFormData.startDate).toDate();
    rental.pickupTime = this.moment(rentalFormData.pickupTime).toDate();

    const createdRental = await this.rentalRepository.save(rental);

    return { data: { ...createdRental } };
  }
}

export default RentalService;
