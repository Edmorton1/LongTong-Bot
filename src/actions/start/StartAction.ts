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

    const word = await getWord(userId);

    if (!word) {
      ctx.reply(t('responses.show_words_list.words_empty', lng));
      return;
    }

    ctx.session.state = 'state_start_input_translate';

    ctx.session.startWord = word;

    ctx.reply(word.original, {
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
    .select(['wordId', 'original', 'translate'])
    .where('userId', '=', userId)
    .limit(1)
    .orderBy('updatedAt', 'asc')
    .executeTakeFirst();
}

export default StartAction;
