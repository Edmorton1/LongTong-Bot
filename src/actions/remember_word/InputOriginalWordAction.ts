import type {MyContext} from '@interfaces/context';
import {t} from '../../locales/i18n';
import {Action} from '../Action';

class InputOriginalWordAction extends Action {
  constructor() {
    super('state_remember_word_original');
  }

  action(ctx: MyContext, lng: string) {
    ctx.session.state = 'state_remember_word_translate';

    ctx.session.originalWord = ctx.message.text;

    ctx.reply(t('responses.start.input_translate', lng), {
      reply_markup: {
        force_reply: true
      }
    });
  }
}

export default InputOriginalWordAction;
