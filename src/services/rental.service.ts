import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { RentalFormData } from '../common/interfaces';
import { RentalRepository, ProductRepository, ItemRepository } from '../repositories';
import { Account, Rental } from '../entities';
import { NotFoundError, ForbiddenError } from '../common/errors';
import { ResourceQueryParams } from '../common/helpers';
import { RentalStatus } from '../common/enums';

@Service()
class RentalService {
  constructor(
    @InjectRepository() private rentalRepository: RentalRepository,
    @InjectRepository() private productRepository: ProductRepository,
    @InjectRepository() private itemRepository: ItemRepository
  ) {}

  public async getCustomerRentals(customer: Account) {
    return await this.rentalRepository.find({
      where: { requestedBy: customer.id },
      order: { createdAt: -1 }
    });
  }

  public async getAllRentals(resourceQueryParams: ResourceQueryParams) {
    return await this.rentalRepository.find(resourceQueryParams);
  }

  public async getOneRental(id: number, resourceQueryParams?: ResourceQueryParams) {
    const rental = await this.rentalRepository.findOne(id, resourceQueryParams);
    if (!rental) throw new NotFoundError('Rental not found');
    return rental;
  }

  public async getCustomerRental(customer: Account, id: number, resourceQueryParams: ResourceQueryParams) {
    const rental = await this.getOneRental(id);

    const wasRentedByCustomer = await customer.hasRented(rental);
    if (!wasRentedByCustomer) throw new ForbiddenError('Rental was not requested by that customer');

    return rental;
  }

  /**
   * RENTAL MANAGEMENT
   */

  public async createCustomerRental(customer: Account, rentalFormData: RentalFormData) {
    const rentalProducts = await this.productRepository.findProductsAvailableForRental(
      rentalFormData.productsIds
    );

    if (!rentalProducts.length) throw new NotFoundError('One of requested products is unavailable');

    const rentalItems = rentalProducts.map(product => product.items[0]);
    await this.itemRepository.setItemsAvailability(rentalItems, false);

    return await this.rentalRepository.createAndSave(customer, rentalProducts, rentalItems, rentalFormData);

    // TODO: SEND EMAIL TO EMPLOYEE
  }

  public async acceptRental(employee: Account, id: number) {
    const rental = await this.getOneRental(id);

    rental.status = RentalStatus.ACCEPTED;
    rental.acceptedBy = employee;
    return await this.rentalRepository.save(rental);

    // TODO: SEND EMAIL TO CUSTOMER
  }

  public async rejectRental(employee: Account, id: number) {
    const rental = await this.getOneRental(id, { relations: ['items'] });

    rental.status = RentalStatus.REJECTED;

    await this.rentalRepository.save(rental);

    return await this.itemRepository.setItemsAvailability(rental.items, true);

    // TODO: SEND EMAIL TO CUSTOMER
  }

  public async finalizeRental(employee: Account, id: number) {
    const rental = await this.getOneRental(id, { relations: ['items'] });

    rental.status = RentalStatus.FINALIZED;

    await this.rentalRepository.save(rental);

    return await this.itemRepository.setItemsAvailability(rental.items, true);

    // TODO: SEND EMAIL TO CUSTOMER
  }
}

export default RentalService;
