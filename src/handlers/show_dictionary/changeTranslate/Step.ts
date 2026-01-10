import {pg} from '@connections';
import {STATES, type TextContext} from '@interfaces/context';
import {IntermediateHandler} from '@telefy/handlers/IntermediateHandler';
import {getUserId} from '@telefy/utils';
import {t} from '../../../locales/i18n';

class Step extends IntermediateHandler {
  react = STATES.changeTranslateOriginal;
  next = STATES.changeTranslateTranslate;

  async action(ctx: TextContext, lng: string) {
    const userId = getUserId(ctx);

    const original = ctx.message.text;

    const wordId = (await getWordIdByOriginal(original, userId))?.wordId;

    if (!wordId) {
      ctx.session.state.type = undefined;
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
