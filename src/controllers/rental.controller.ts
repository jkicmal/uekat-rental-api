import { JsonController, Post, Body, Authorized, CurrentUser, Get } from 'routing-controllers';
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
  public async customerCreate(
    @CurrentUser({ required: true }) customer: Account,
    @Body() rentalFormData: RentalFormData
  ) {
    return this.rentalService.create(customer, rentalFormData);
  }

  @Authorized(AccountType.CUSTOMER)
  @Get('/api/v1/customer/rentals')
  public async customerGetAll(@CurrentUser({ required: true }) customer: Account) {
    const rentals = await this.rentalService.getCustomerRentals(customer);
    return { data: { rentals } };
  }
}
