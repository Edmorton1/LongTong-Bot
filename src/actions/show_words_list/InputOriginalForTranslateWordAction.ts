import type {MyContext} from '@interfaces/context';
import {refreshWordList} from '@utils';
import {t} from '../../locales/i18n';
import {Action} from '../Action';

class InputOriginalForTranslateWordAction extends Action {
  constructor() {
    super('responses.show_words_list.edit_word.input_original');
  }

  async action(ctx: MyContext, lng: string) {
    const words = await refreshWordList(ctx, ctx.from!.id);
    const original = words.find(
      (dbWord) => dbWord.original === ctx.message.text
    )?.original;

    if (!original) {
      ctx.reply(t('responses.show_words_list.edit_word.word_not_found', lng));
      return;
    }

    ctx.session.originalForTranslateChange = original;

    ctx.reply(t('responses.show_words_list.edit_word.input_translate', lng), {
      reply_markup: {
        force_reply: true
      }
    });
  }
}

export default InputOriginalForTranslateWordAction;
