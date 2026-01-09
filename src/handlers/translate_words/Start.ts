import {pg} from '@connections';
import {type MyContext, STATES} from '@interfaces/context';
import {StartHandler} from '@telefy/StartHandler';
import {getUserId} from '@utils';
import {sql} from 'kysely';
import {t} from '../../locales/i18n';

class Start extends StartHandler {
  next = STATES.startInputTranslate;

  constructor() {
    super({command: 'translate_words', text: 'keyboard.translate_word'});
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
  return pg()
    .selectFrom('words')
    .select(['wordId', 'original'])
    .where('userId', '=', userId)
    .orderBy(
      sql`
        CASE
          WHEN "correct" = 0 AND "incorrect" = 0 THEN 0
          WHEN "correct" = "incorrect" THEN 1
          WHEN "incorrect" > "correct" THEN 2
          ELSE 3
        END
      `,
      'asc'
    )
    .orderBy('correct', 'asc')
    .orderBy('updatedAt', 'asc')
    .orderBy('updatedAt', 'asc')
    .executeTakeFirst();
}

export default Start;
