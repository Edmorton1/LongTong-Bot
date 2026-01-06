import {pg} from '@connections';
import type {MyContext} from '@interfaces/context';
import {getUserId} from '@utils';
import {t} from '../../../locales/i18n';
import {Action} from '../../Action';

class deleteWordAction extends Action {
  constructor() {
    super('responses.show_words_list.delete_word.input_original');
  }

  async action(ctx: MyContext, lng: string) {
    const word = ctx.message.text;
    const userId = getUserId(ctx);

    const isDeleted = await deleteWord(word, userId);

    if (!isDeleted) {
      ctx.reply(t('responses.show_words_list.delete_word.not_found', lng));
      return;
    }

    ctx.reply(t('responses.show_words_list.delete_word.successful', lng));
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

export default deleteWordAction;
