import {
  JsonController,
  Post,
  Body,
  Authorized,
  CurrentUser,
  Get,
  QueryParams,
  Param
} from 'routing-controllers';
import { Service } from 'typedi';

import { RentalFormData } from '../common/interfaces';
import { RentalService } from '../services';
import { AccountType } from '../common/enums';
import { Account, Rental } from '../entities';
import { ResourceQueryParamsBuilder, ResourceQueryPathParams } from '../common/helpers';

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
    return { data: rentals };
  }

  @Authorized(AccountType.EMPLOYEE)
  @Get('/api/v1/employee/rentals')
  public async employeeGetAll(@QueryParams() resourceQueryPathParams: ResourceQueryPathParams) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Rental>(
      resourceQueryPathParams
    ).applyRelations(['items']).resourceQueryParams;
    const rentals = await this.rentalService.getAllRentals(resourceQueryParams);
    return { data: rentals };
  }

  @Authorized(AccountType.EMPLOYEE)
  @Get('/api/v1/employee/rentals/:id')
  public async employeeGetOne(
    @Param('id') id: number,
    @QueryParams() resourceQueryPathParams: ResourceQueryPathParams
  ) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Rental>(
      resourceQueryPathParams
    ).applyRelations(['items']).resourceQueryParams;
    const rentals = await this.rentalService.getOneRental(id, resourceQueryParams);
    return { data: rentals };
  }
}
