import {pg} from '@connections';
import {type MyContext, STATES} from '@interfaces/context';
import {EndHandler} from '@telefy/EndHandler';
import {t} from '../../../locales/i18n';

class End extends EndHandler {
  react = STATES.changeTranslateTranslate;

  async action(ctx: MyContext, lng: string) {
    ctx.session.state.type = undefined;
    const wordId = ctx.session.state.data;
    ctx.session.state.data = undefined;

    const translate = ctx.message.text;

    await changeWord(wordId, translate);

    ctx.reply(t('responses.show_dictionary.edit_word.translate_changed', lng));
  }
}

function changeWord(wordId: number, translate: string) {
  return pg()
    .updateTable('words')
    .set('translate', translate)
    .where('wordId', '=', wordId)
    .execute();
}

export default End;
