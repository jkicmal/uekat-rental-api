import 'reflect-metadata';
import { config } from 'dotenv';
import { createConnection } from 'typeorm';
config();

const main = async () => {
  try {
    await createConnection();
  } catch (err) {}
};

main();
