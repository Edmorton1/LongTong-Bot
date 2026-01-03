import type {MyContext} from '@interfaces/context';
import {Action} from '../Action';

class ShowWordsListAction extends Action {
  constructor() {
    super('keyboard.show_words_list');
  }

  action(ctx: MyContext, lng: string) {
    ctx.reply('mock show words list');
  }
}

export default ShowWordsListAction;
