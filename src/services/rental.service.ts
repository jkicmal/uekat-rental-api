import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { RentalFormData } from '../common/interfaces';
import { RentalRepository, ProductRepository, ItemRepository } from '../repositories';
import { Rental, Account } from '../entities';
import { MomentToken, MomentInstance } from '../common/tokens';
import { NotFoundError, ForbiddenError } from '../common/errors';
import { sum } from '../common/utils/math.utils';
import { ResourceQueryParams } from '../common/helpers';

@Service()
class RentalService {
  constructor(
    @InjectRepository() private rentalRepository: RentalRepository,
    @InjectRepository() private productRepository: ProductRepository,
    @InjectRepository() private itemRepository: ItemRepository,
    @Inject(MomentToken) private moment: MomentInstance
  ) {}

  public async createCustomerRental(customer: Account, rentalFormData: RentalFormData) {
    const productsToRent = await this.productRepository.findProductsAvailableForRental(
      rentalFormData.productsIds
    );

    if (!productsToRent.length) throw new NotFoundError('One of requested products is unavailable');

    const itemsForRent = productsToRent.map(product => product.items[0]);
    await this.itemRepository.setItemsAvailability(itemsForRent, false);

    const rental = new Rental();
    rental.requestedBy = customer;
    rental.products = productsToRent;
    rental.items = itemsForRent;
    rental.priceTotal = sum(productsToRent.map(product => product.price));
    rental.depositTotal = sum(productsToRent.map(product => product.deposit));
    rental.endDate = this.moment(rentalFormData.endDate).toDate();
    rental.startDate = this.moment(rentalFormData.startDate).toDate();
    rental.pickupTime = this.moment(rentalFormData.pickupTime).toDate();

    const createdRental = await this.rentalRepository.save(rental);

    return createdRental;
  }

  public async getCustomerRentals(customer: Account) {
    return await this.rentalRepository.find({
      where: { requestedBy: customer.id },
      order: { createdAt: -1 }
    });
  }

  public async getAllRentals(resourceQueryParams: ResourceQueryParams) {
    return await this.rentalRepository.find(resourceQueryParams);
  }

  public async getOneRental(id: number, resourceQueryParams: ResourceQueryParams) {
    return await this.rentalRepository.findOne(id, resourceQueryParams);
  }

  public async getCustomerRental(customer: Account, id: number, resourceQueryParams: ResourceQueryParams) {
    const rental = await this.rentalRepository.findOne(id, resourceQueryParams);

    if (!rental) throw new NotFoundError('Rental not found');

    const wasRentedByCustomer = await customer.hasRented(rental);
    if (!wasRentedByCustomer) throw new ForbiddenError('Rental was not requested by that customer');

    return rental;
  }
}

export default RentalService;
