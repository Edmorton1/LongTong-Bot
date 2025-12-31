import {getEnv} from '@utils';
import pino, {type LoggerOptions, type Logger as PinoLogger} from 'pino';
import type {Connection} from '../types';

const config: LoggerOptions = {
  level: 'debug',
  transport:
    getEnv('NODE_ENV') === 'development'
      ? {
          target: 'pino-pretty',
          options: {colorize: true}
        }
      : undefined
};

class Logger implements Connection {
  private _logger: PinoLogger | null = null;

  public connect = () => {
    this._logger = pino(config);
    this._logger.info('LOGGER CONNECT');
  };

  public get(): PinoLogger {
    if (!this._logger) {
      throw new Error('Logger is not connected');
    }
    return this._logger;
  }

  public disconnect() {
    if (this._logger) {
      this._logger.info('LOGGER DISCONNECT');
      this._logger.flush();
      this._logger = null;
    }
  }
}

export default new Logger();
