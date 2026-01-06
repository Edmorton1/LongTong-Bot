import type {MyContext} from '@interfaces/context';
import {t} from '../../locales/i18n';
import {Action} from '../Action';

class RememberWordStartAction extends Action {
  constructor() {
    super('keyboard.remember_word');
  }

  action(ctx: MyContext, lng: string) {
    ctx.session.state = 'state_remember_word_original';

    ctx.reply(t('responses.start.input_original', lng), {
      reply_markup: {
        force_reply: true
      }
    });
  }
}

export default RememberWordStartAction;
