import Container, { Service } from 'typedi';
import { Repository, EntityRepository } from 'typeorm';
import { Rental, Account, Product, Item } from '../entities';
import { sum } from '../common/utils/math.utils';
import { RentalFormData } from '../common/interfaces';
import { MomentToken } from '../common/tokens';

@Service()
@EntityRepository(Rental)
export class RentalRepository extends Repository<Rental> {
  createAndSave(customer: Account, products: Product[], items: Item[], rentalFormData: RentalFormData) {
    const moment = Container.get(MomentToken);

    const rental = new Rental();
    rental.requestedBy = customer;
    rental.products = products;
    rental.items = items;
    rental.priceTotal = sum(products.map(product => product.price));
    rental.depositTotal = sum(products.map(product => product.deposit));
    rental.endDate = moment(rentalFormData.endDate).toDate();
    rental.startDate = moment(rentalFormData.startDate).toDate();
    rental.pickupTime = moment(rentalFormData.pickupTime).toDate();

    return this.save(rental);
  }
}
