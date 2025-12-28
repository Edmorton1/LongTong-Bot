import {writeFileSync} from 'node:fs';

const config = {
  url: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  dialect: 'postgres',
  outFile: './src/connections/postgres/types.ts'
};

writeFileSync('./kysely-codegen.config.json', JSON.stringify(config, null, 2));
