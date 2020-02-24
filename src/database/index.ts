import { createConnection, Connection } from 'typeorm';

import * as entities from './entities';

const init = async () => {
  const connection: Connection = await createConnection();
};

export { entities, init };
