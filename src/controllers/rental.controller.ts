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
    const rental = await this.rentalService.createCustomerRental(customer, rentalFormData);
    return { data: rental };
  }

  @Authorized(AccountType.CUSTOMER)
  @Get('/api/v1/customer/rentals')
  public async customerGetAll(@CurrentUser({ required: true }) customer: Account) {
    const rentals = await this.rentalService.getCustomerRentals(customer);
    return { data: rentals };
  }

  @Authorized(AccountType.CUSTOMER)
  @Get('/api/v1/customer/rentals/:id')
  public async customerGetOne(
    @Param('id') id: number,
    @CurrentUser({ required: true }) customer: Account,
    @QueryParams() resourceQueryPathParams: ResourceQueryPathParams
  ) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Rental>(
      resourceQueryPathParams
    ).applyRelations(['products', 'products.category']).resourceQueryParams;
    const rentals = await this.rentalService.getCustomerRental(customer, id, resourceQueryParams);
    return { data: rentals };
  }

  @Authorized(AccountType.EMPLOYEE)
  @Get('/api/v1/employee/rentals')
  public async employeeGetAll(@QueryParams() resourceQueryPathParams: ResourceQueryPathParams) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Rental>(resourceQueryPathParams)
      .applyRelations(['requestedBy'])
      .applyOrder().resourceQueryParams;
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
    ).applyRelations(['items', 'requestedBy', 'items.product', 'items.product.category']).resourceQueryParams;
    const rental = await this.rentalService.getOneRental(id, resourceQueryParams);
    return { data: rental };
  }

  @Authorized(AccountType.EMPLOYEE)
  @Post('/api/v1/employee/rentals/:id/accept')
  public async employeeAcceptRental(
    @CurrentUser({ required: true }) employee: Account,
    @Param('id') id: number
  ) {
    const rental = await this.rentalService.acceptRental(employee, id);
    return { data: rental };
  }

  @Authorized(AccountType.EMPLOYEE)
  @Post('/api/v1/employee/rentals/:id/reject')
  public async employeeRejectRental(
    @CurrentUser({ required: true }) employee: Account,
    @Param('id') id: number
  ) {
    const rental = await this.rentalService.rejectRental(employee, id);
    return { data: rental };
  }

  @Authorized(AccountType.EMPLOYEE)
  @Post('/api/v1/employee/rentals/:id/finalize')
  public async employeeFinalizeRental(
    @CurrentUser({ required: true }) employee: Account,
    @Param('id') id: number
  ) {
    const rental = await this.rentalService.finalizeRental(employee, id);
    return { data: rental };
  }
}
