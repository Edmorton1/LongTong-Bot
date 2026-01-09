import {connect} from '@connections';
import type {MyContext} from '@interfaces/context';
import {getEnv} from '@utils';
import {Telegraf} from 'telegraf';
import {start} from './handlers/index';

connect();

const bot = new Telegraf<MyContext>(getEnv('BOT_KEY'));

start(bot);
