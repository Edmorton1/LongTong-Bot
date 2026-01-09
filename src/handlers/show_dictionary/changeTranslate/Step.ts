import {pg} from '@connections';
import {type MyContext, STATES} from '@interfaces/context';
import {IntermediateHandler} from '@telefy/IntermediateHandler';
import {getUserId} from '@utils';
import {t} from '../../../locales/i18n';

class Step extends IntermediateHandler {
  react = STATES.changeTranslateOriginal;
  next = STATES.changeTranslateTranslate;

  async action(ctx: MyContext, lng: string) {
    const userId = getUserId(ctx);

    const original = ctx.message.text;

    const wordId = (await getWordIdByOriginal(original, userId))?.wordId;

    if (!wordId) {
      ctx.reply(t('responses.show_dictionary.edit_word.word_not_found', lng));
      return;
    }

    ctx.session.state.type = this.next;
    ctx.session.state.data = wordId;

    ctx.reply(t('responses.show_dictionary.edit_word.input_translate', lng));
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

export default Step;
