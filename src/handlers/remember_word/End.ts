import {logger, pg} from '@connections';
import type {Users, Words} from '@domain';
import {type MyContext, STATES} from '@interfaces/context';
import {EndHandler} from '@telefy/EndHandler';
import {getUserId} from '@utils';
import {t} from '../../locales/i18n';

class End extends EndHandler {
  react = STATES.rememberWordTranslate;

  async action(ctx: MyContext, lng: string) {
    ctx.session.state.type = undefined;
    const original = ctx.session.state.data;
    ctx.session.state.data = undefined;

    const userId = getUserId(ctx);

    const translate = ctx.message.text;

    try {
      await saveWordAndCreateRelation({userId, original, translate});
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        // Код ошибки уникальности
        err.code === '23505'
      ) {
        ctx.reply(t('responses.remember_word.unique_error', lng));
        return;
      }
      logger().error(err);
      throw err;
    }

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

export default End;
