import { Get, JsonController, Authorized, QueryParams } from 'routing-controllers';
import { Account } from '../entities';
import { AccountType } from '../common/enums';
import { ResourceQueryPathParams, ResourceQueryParamsBuilder } from '../common/helpers';
import AccountService from '../services/account.service';

@JsonController()
export class AccountsController {
  constructor(private accountService: AccountService) {}

  @Get('/api/v1/employee/accounts')
  @Authorized(AccountType.EMPLOYEE)
  async employeeGetAll(@QueryParams() resourceQueryPathParams: ResourceQueryPathParams) {
    const resourceQueryParams = new ResourceQueryParamsBuilder<Account>(resourceQueryPathParams).applyWhere()
      .resourceQueryParams;

    return this.accountService.getAll(resourceQueryParams);
  }
}
