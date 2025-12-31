import type {MyContext} from '@interfaces/context';
import {Action} from './Action';

class StartAction extends Action {
  constructor() {
    super('welcome', 'action');
  }

  action(ctx: MyContext) {
    ctx.reply('welcome command');
  }
}

export default StartAction;
