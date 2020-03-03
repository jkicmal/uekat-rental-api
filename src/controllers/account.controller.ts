import { Service } from 'typedi';

@Service()
export class AccountController {
  public getAll() {
    console.log('[Account Controller] getAll()');
  }
  public getOne(id: number) {
    console.log(`[Account Controller] getOne(${id})`);
  }
}
