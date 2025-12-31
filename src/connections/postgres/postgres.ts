import {logger} from '@connections';
import {Kysely} from 'kysely';
import {createDialect} from '../../../.config/dialect';
import type {Connection} from '../types';
import type {DB} from './types';

class Postgres implements Connection {
  private _pg: Kysely<DB> | null = null;

  public connect() {
    const dialect = createDialect();

    logger().info('POSTGRES CONNECT');
    this._pg = new Kysely<DB>({dialect});
  }

  public get(): Kysely<DB> {
    if (!this._pg) throw new Error('Postgres is not connected');
    return this._pg;
  }

  public async disconnect() {
    if (this._pg) {
      logger().info('POSTGRES DISCONNECT');
      await this._pg.destroy();
      this._pg = null;
    }
  }
}

export default new Postgres();
