import {Logger} from './logger/logger';
import {Postgres} from './postgres/postgres';

const postgresInstance = new Postgres();
const loggerInstance = new Logger();

const connect = () => {
  loggerInstance.connect();
  postgresInstance.connect();
};

const logger = () => loggerInstance.get();
const pg = () => postgresInstance.get();

export {connect, logger, pg};
