import {pg} from '@connections';
import type {Users, Words} from '@domain';
import type {MyContext} from '@interfaces/context';
import {getUserId} from '@utils';
import {t} from '../../locales/i18n';
import {Action} from '../Action';

class InputTranslateWordAction extends Action {
  constructor() {
    super('state_remember_word_translate');
  }

  async action(ctx: MyContext, lng: string) {
    ctx.session.state = undefined;

    const userId = getUserId(ctx);

    const original = ctx.session.originalWord;

    if (!original) {
      ctx.reply(t('responses.remember_word.input_original', lng));
      return;
    }

    const translate = ctx.message.text;

    await saveWordAndCreateRelation({userId, original, translate});

    ctx.session.originalWord = undefined;

    ctx.reply(
      t('responses.remember_word.word_saved', lng, {
        original,
        translate
      })
    );
  }
}

function saveWordAndCreateRelation(
  word: {userId: Users['id']} & Pick<Words, 'original' | 'translate'>
) {
  return pg()
    .insertInto('words')
    .values({...word})
    .execute();
}

export default InputTranslateWordAction;
