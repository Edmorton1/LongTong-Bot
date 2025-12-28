import {Kysely} from 'kysely';
import {createDialect} from '../../../.config/dialect';
import type {Connection} from '../types.js';
import type {DB} from './types.js';

class Postgres implements Connection {
  private _pg: Kysely<DB> | null = null;

  public connect() {
    const dialect = createDialect();

    this._pg = new Kysely<DB>({dialect});
  }

  public get(): Kysely<DB> {
    if (!this._pg) throw new Error('Postgres is not connected');
    return this._pg;
  }

  public async disconnect() {
    if (this._pg) {
      await this._pg.destroy();
      this._pg = null;
    }
  }
}

export default new Postgres();
