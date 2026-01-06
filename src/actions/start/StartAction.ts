import {pg} from '@connections';
import type {MyContext} from '@interfaces/context';
import {getUserId} from '@utils';
import {t} from '../../locales/i18n';
import {Action} from '../Action';

class StartAction extends Action {
  constructor() {
    super('keyboard.start');
  }

  async action(ctx: MyContext, lng: string) {
    const userId = getUserId(ctx);

    const original = (await getWord(userId))?.original;

    if (!original) {
      ctx.reply(t('responses.show_words_list.words_empty', lng));
      return;
    }

    ctx.reply(original, {
      reply_markup: {
        force_reply: true
      }
    });
  }
}

function getWord(userId: number) {
  // TODO: Пока будет брать только самые старые слова
  return pg()
    .selectFrom('words')
    .select('original')
    .where('userId', '=', userId)
    .limit(1)
    .orderBy('updatedAt', 'asc')
    .executeTakeFirst();
}

export default StartAction;
