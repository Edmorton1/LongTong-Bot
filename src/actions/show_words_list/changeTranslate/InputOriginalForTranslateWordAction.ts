import {pg} from '@connections';
import type {MyContext} from '@interfaces/context';
import {getUserId} from '@utils';
import {t} from '../../../locales/i18n';
import {Action} from '../../Action';

class InputOriginalForTranslateWordAction extends Action {
  constructor() {
    super('responses.show_words_list.edit_word.input_original');
  }

  async action(ctx: MyContext, lng: string) {
    const userId = getUserId(ctx);

    const original = ctx.message.text;

    const wordId = (await getWordIdByOriginal(original, userId))?.wordId;

    if (!wordId) {
      ctx.reply(t('responses.show_words_list.edit_word.word_not_found', lng));
      return;
    }

    ctx.session.wordIdForTranslate = wordId;

    ctx.reply(t('responses.show_words_list.edit_word.input_translate', lng), {
      reply_markup: {
        force_reply: true
      }
    });
  }
}

function getWordIdByOriginal(original: string, userId: number) {
  return pg()
    .selectFrom('words')
    .select('wordId')
    .where('userId', '=', userId)
    .where('original', '=', original)
    .executeTakeFirst();
}

export default InputOriginalForTranslateWordAction;
