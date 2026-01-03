import type {MyContext} from '@interfaces/context';
import {Action} from '../Action';

class LoadWordDictionaryAction extends Action {
  constructor() {
    super('keyboard.load_word_dictionary');
  }

  action(ctx: MyContext, lng: string) {
    ctx.reply('mock word dictionary');
  }
}

export default LoadWordDictionaryAction;
