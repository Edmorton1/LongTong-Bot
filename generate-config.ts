import {writeFileSync} from 'node:fs';
import {getEnv} from '@utils';

const config = {
  url: `postgres://${getEnv('DB_USER')}:${getEnv('DB_PASSWORD')}@${getEnv('DB_HOST')}:${getEnv('DB_PORT')}/${getEnv('DB_DATABASE')}`,
  dialect: 'postgres',
  outFile: './src/connections/postgres/types.ts'
};

writeFileSync('./kysely-codegen.config.json', JSON.stringify(config, null, 2));
