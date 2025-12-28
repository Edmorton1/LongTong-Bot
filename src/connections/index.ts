import Logger from './logger/logger';
import Postgres from './postgres/postgres';

const connect = () => {
  Logger.connect();
  Postgres.connect();
};

const logger = () => Logger.get();
const pg = () => Postgres.get();

export {connect, logger, pg};
