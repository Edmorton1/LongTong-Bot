import type {MyContext} from '@interfaces/context';
import {Action} from './Action';

class KeyboardAction extends Action {
  constructor() {
    super('keyboard.remember_word', 'action');
  }

  action(ctx: MyContext) {
    ctx.reply('Keyboard action');
  }
}

export default KeyboardAction;
