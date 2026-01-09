import {pg} from '@connections';
import {type MyContext, STATES} from '@interfaces/context';
import {StartHandler} from '@telefy/StartHandler';
import {getUserId} from '@utils';
import {t} from '../../locales/i18n';

class Start extends StartHandler {
  next = STATES.startInputTranslate;

  constructor() {
    super({command: 'translate_words', text: 'keyboard.start'});
  }

  async action(ctx: MyContext, lng: string) {
    const userId = getUserId(ctx);

    const word = await getWord(userId);

    if (!word) {
      ctx.reply(t('responses.show_dictionary.words_empty', lng));
      return;
    }

    const {wordId, original} = word;

    ctx.session.state.type = this.next;
    ctx.session.state.data = wordId;

    ctx.reply(original);
  }
}

function getWord(userId: number) {
  // TODO: Пока будет брать только самые старые слова
  return pg()
    .selectFrom('words')
    .select(['wordId', 'original'])
    .where('userId', '=', userId)
    .limit(1)
    .orderBy('updatedAt', 'asc')
    .executeTakeFirst();
}

export default Start;
