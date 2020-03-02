import 'reflect-metadata';
import { config } from 'dotenv';
config();
import { createConnection, getRepository } from 'typeorm';
import { entities } from './database';

const main = async () => {
  try {
    await createConnection();
    const accountRepository = getRepository(entities.Account);
    const myAccounts = await accountRepository.findAndCount();
  } catch (err) {}
};

main();
