import { JsonController, Post, Body, Authorized, CurrentUser } from 'routing-controllers';
import { Service } from 'typedi';

import { RentalFormData } from '../common/interfaces';
import { RentalService } from '../services';
import { AccountType } from '../common/enums';
import { Account } from '../entities';

@Service()
@JsonController()
export class ProductController {
  constructor(private rentalService: RentalService) {}

  @Authorized(AccountType.CUSTOMER)
  @Post('/api/v1/customer/rentals')
  public async create(
    @CurrentUser({ required: true }) customer: Account,
    @Body() rentalFormData: RentalFormData
  ) {
    return this.rentalService.create(customer, rentalFormData);
  }
}
