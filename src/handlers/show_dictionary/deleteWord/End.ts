import {pg} from '@connections';
import {type MyContext, STATES} from '@interfaces/context';
import {EndHandler} from '@telefy/EndHandler';
import {getUserId} from '@utils';
import {t} from '../../../locales/i18n';

class End extends EndHandler {
  react = STATES.deleteWord;

  async action(ctx: MyContext, lng: string) {
    ctx.session.state.type = undefined;

    const word = ctx.message.text;
    const userId = getUserId(ctx);

    const isDeleted = await deleteWord(word, userId);

    if (!isDeleted) {
      ctx.reply(t('responses.show_dictionary.delete_word.not_found', lng));
      return;
    }

    ctx.reply(t('responses.show_dictionary.delete_word.successful', lng));
  }
}

async function deleteWord(word: string, userId: number) {
  const [deleted] = await pg()
    .deleteFrom('words')
    .where('original', '=', word)
    .where('userId', '=', userId)
    .returning('original')
    .execute();

  if (!deleted?.original) {
    return false;
  }

  return true;
}

export default End;
