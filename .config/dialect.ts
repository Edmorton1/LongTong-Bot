import {PostgresDialect} from 'kysely';
import {Pool} from 'pg';

export const createDialect = () => {
  return new PostgresDialect({
    pool: new Pool({
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT)
    })
  });
};
