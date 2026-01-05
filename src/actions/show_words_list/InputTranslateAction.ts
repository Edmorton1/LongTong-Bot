import {pg} from '@connections';
import type {MyContext} from '@interfaces/context';
import {t} from '../../locales/i18n';
import {Action} from '../Action';

class InputTranslateAction extends Action {
  constructor() {
    super('responses.show_words_list.edit_word.input_translate');
  }

  async action(ctx: MyContext, lng: string) {
    const translate = ctx.message.text;
    const original = ctx.session.originalForTranslateChange;

    if (!original) {
      throw new Error('No original word for change!');
    }

    await this.changeWord(original, translate);

    ctx.session.originalForTranslateChange = undefined;
    ctx.session.words = undefined;

    ctx.reply(t('responses.show_words_list.edit_word.translate_changed', lng));
  }

  private changeWord(original: string, translate: string) {
    return pg()
      .updateTable('words')
      .set('translate', translate)
      .where('original', '=', original)
      .execute();
  }
}

export default InputTranslateAction;
