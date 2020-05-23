import { Service, Inject } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { RentalFormData, Config } from '../common/interfaces';
import { RentalRepository, ProductRepository, ItemRepository, AccountRepository } from '../repositories';
import { Account } from '../entities';
import { NotFoundError, ForbiddenError } from '../common/errors';
import { ResourceQueryParams } from '../common/helpers';
import { RentalStatus } from '../common/enums';

import MailService from './mail.service';
import { ConfigToken } from '../common/tokens';

@Service()
class RentalService {
  constructor(
    @InjectRepository() private rentalRepository: RentalRepository,
    @InjectRepository() private productRepository: ProductRepository,
    @InjectRepository() private itemRepository: ItemRepository,
    @InjectRepository() private accountRepository: AccountRepository,
    @Inject(ConfigToken) private config: Config,
    private mailService: MailService
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
    const rental = await this.getOneRental(id, resourceQueryParams);

    const wasRentedByCustomer = await customer.hasRented(rental);
    if (!wasRentedByCustomer) throw new ForbiddenError('Rental was not requested by that customer');

    return rental;
  }

  /**
   * RENTAL MANAGEMENT
   */

  public async createCustomerRental(customer: Account, rentalFormData: RentalFormData) {
    // Get products to rent
    const rentalProducts = await this.productRepository.findProductsAvailableForRental(
      rentalFormData.productsIds
    );

    if (!rentalProducts.length) throw new NotFoundError('One of requested products is unavailable');

    // Get items to rent out
    const rentalItems = rentalProducts.map(product => product.items[0]);

    // Mark items as unavailable
    await this.itemRepository.setItemsAvailability(rentalItems, false);

    // Create rental
    const rental = await this.rentalRepository.createAndSave(
      customer,
      rentalProducts,
      rentalItems,
      rentalFormData
    );

    // Send email to employee
    const employeesReceivingEmails = await this.accountRepository.getEmployeesThatReceiveEmails();
    this.mailService.sendMailToMultipleAccounts(
      employeesReceivingEmails,
      'Rental Created',
      `New renal was created, check it out at ${this.config.fontApp.employeeRentalPath(rental.id)}`
    );

    return rental;
  }

  public async acceptRental(employee: Account, id: number) {
    const rental = await this.getOneRental(id, { relations: ['requestedBy'] });

    rental.status = RentalStatus.ACCEPTED;
    rental.acceptedBy = employee;

    await this.rentalRepository.save(rental);

    // Send email to customer
    if (rental.requestedBy.receiveEmails)
      this.mailService.sendMailToAccount(
        rental.requestedBy,
        'Rental Accepted',
        `Your rental was accepted! Check it out at ${this.config.fontApp.customerRentalPath(rental.id)}`
      );

    return rental;
  }

  public async rejectRental(employee: Account, id: number) {
    const rental = await this.getOneRental(id, { relations: ['items', 'requestedBy'] });

    rental.status = RentalStatus.REJECTED;
    rental.rejectedBy = employee;

    await this.itemRepository.setItemsAvailability(rental.items, true);

    await this.rentalRepository.save(rental);

    // Send email to customer
    if (rental.requestedBy.receiveEmails)
      this.mailService.sendMailToAccount(
        rental.requestedBy,
        'Rental Rejected',
        `Your rental was rejected! Check it out at ${this.config.fontApp.employeeRentalPath(rental.id)}`
      );

    return rental;
  }

  public async finalizeRental(employee: Account, id: number) {
    const rental = await this.getOneRental(id, { relations: ['items', 'requestedBy'] });

    rental.status = RentalStatus.FINALIZED;
    rental.finalizedBy = employee;

    await this.itemRepository.setItemsAvailability(rental.items, true);

    await this.rentalRepository.save(rental);

    // Send email to customer
    if (rental.requestedBy.receiveEmails)
      this.mailService.sendMailToAccount(
        rental.requestedBy,
        'Rental Finalized',
        `Thanks for using our services, we really apprecieate it.`
      );

    return rental;
  }

  public async cancelRental(employee: Account, id: number) {
    const rental = await this.getOneRental(id, { relations: ['items', 'requestedBy'] });

    rental.status = RentalStatus.CANCELLED;
    rental.cancelledBy = employee;

    await this.itemRepository.setItemsAvailability(rental.items, true);

    await this.rentalRepository.save(rental);

    // Send email to customer
    if (rental.requestedBy.receiveEmails)
      this.mailService.sendMailToAccount(
        rental.requestedBy,
        'Rental Cancelled',
        `We are sorry but your rental ${this.config.fontApp.customerRentalPath(
          rental.id
        )} has been cancelled.`
      );

    return rental;
  }
}

export default RentalService;
