import {getEnv} from '@utils';
import {PostgresDialect} from 'kysely';
import {Pool} from 'pg';

export const createDialect = () => {
  return new PostgresDialect({
    pool: new Pool({
      host: getEnv('DB_HOST'),
      database: getEnv('DB_DATABASE'),
      user: getEnv('DB_USER'),
      password: getEnv('DB_PASSWORD'),
      port: Number(getEnv('DB_PORT'))
    })
  });
};
