import type {MyContext} from '@interfaces/context';
import {Action} from '../Action';

class StartAction extends Action {
  constructor() {
    super('keyboard.start');
  }

  action(ctx: MyContext, lng: string) {
    ctx.reply('mock start');
  }
}

export default StartAction;
