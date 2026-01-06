import {pg} from '@connections';
import type {MyContext} from '@interfaces/context';
import {t} from '../../../locales/i18n';
import {Action} from '../../Action';

class InputTranslateAction extends Action {
  constructor() {
    super('state_change_translate_translate');
  }

  async action(ctx: MyContext, lng: string) {
    ctx.session.state = undefined;

    const translate = ctx.message.text;
    const wordId = ctx.session.wordIdForTranslate;

    if (!wordId) {
      throw new Error('No original word for change!');
    }

    await changeWord(wordId, translate);

    ctx.session.wordIdForTranslate = undefined;

    ctx.reply(t('responses.show_words_list.edit_word.translate_changed', lng));
  }
}

function changeWord(wordId: number, translate: string) {
  return pg()
    .updateTable('words')
    .set('translate', translate)
    .where('wordId', '=', wordId)
    .execute();
}

export default InputTranslateAction;
