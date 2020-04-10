import { Get, JsonController, Authorized, QueryParams, Param, Put, Body, Delete } from 'routing-controllers';
import { Account } from '../entities';
import { AccountType } from '../common/enums';
import { ResourceQueryPathParams, ResourceQueryParamsBuilder } from '../common/helpers';
import AccountService from '../services/account.service';
import { AccountEditFormData } from '../common/interfaces';

@JsonController()
export class AccountsController {
  constructor(private accountService: AccountService) {}

  @Get('/api/v1/employee/accounts')
  @Authorized(AccountType.EMPLOYEE)
  async employeeGetAll(@QueryParams() resourceQueryPathParams: ResourceQueryPathParams) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Account>(resourceQueryPathParams).applyWhere()
      .resourceQueryParams;

    const accounts = await this.accountService.getAll(resourceQueryParams);

    return { data: accounts };
  }

  @Get('/api/v1/employee/accounts/:id')
  @Authorized(AccountType.EMPLOYEE)
  async employeeGetOne(
    @Param('id') id: number,
    @QueryParams() resourceQueryPathParams: ResourceQueryPathParams
  ) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Account>(resourceQueryPathParams)
      .applyWhere()
      .applyRelations(['requestedRentals']).resourceQueryParams;

    const account = await this.accountService.getOne(id, resourceQueryParams);

    return { data: account };
  }

  @Put('/api/v1/employee/accounts/:id')
  @Authorized(AccountType.EMPLOYEE)
  async employeeUpdateOne(@Param('id') id: number, @Body() accountEditFormData: AccountEditFormData) {
    const account = await this.accountService.updateOne(id, accountEditFormData);

    return { data: account };
  }

  @Delete('/api/v1/employee/accounts/:id')
  @Authorized(AccountType.EMPLOYEE)
  async employeeDeleteOne(@Param('id') id: number) {
    const account = await this.accountService.deleteOne(id);

    return { data: account };
  }
}
