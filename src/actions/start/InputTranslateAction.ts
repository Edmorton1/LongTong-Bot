import {pg} from '@connections';
import type {MyContext} from '@interfaces/context';
import {getUserId} from '@utils';
import {t} from '../../locales/i18n';
import {Action} from '../Action';

class InputTranslateAction extends Action {
  constructor() {
    super('state_start_input_translate');
  }

  async action(ctx: MyContext, lng: string) {
    const userId = getUserId(ctx);
    const word = ctx.session.startWord;

    if (!word) {
      ctx.reply(t(''));
    }

    const {} = await checkCorrectly(word, userId);
  }
}

function checkCorrectly(
  word: NonNullable<MyContext['session']['startWord']>,
  userId: number
) {
  const {wordId, translate} = word;

  return pg()
    .updateTable('words')
    .where('userId', '=', userId)
    .where('wordId', '=', wordId)
    .set((qb) => ({
      correct: qb
        .case()
        .when(qb('translate', '=', translate))
        .then(qb('correct', '+', 1))
        .else(qb.ref('correct'))
        .end(),

      incorrect: qb
        .case()
        .when(qb('translate', '!=', translate))
        .then(qb('incorrect', '+', 1))
        .else(qb.ref('incorrect'))
        .end()
    }))
    .returning(['translate', 'correct', 'incorrect'])
    .executeTakeFirst();
}

export default InputTranslateAction;
