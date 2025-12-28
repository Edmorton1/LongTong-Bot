import {PostgresDialect} from 'kysely';
import {defineConfig} from 'kysely-ctl';
import {Pool} from 'pg';
import {createDialect} from './dialect';

export default defineConfig({
  dialect: createDialect()
  //   migrations: {
  //     migrationFolder: "migrations",
  //   },
  //   plugins: [],
  //   seeds: {
  //     seedFolder: "seeds",
  //   }
});
