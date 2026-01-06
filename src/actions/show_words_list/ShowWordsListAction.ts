import {pg} from '@connections';
import type {MyContext} from '@interfaces/context';
import {getUserId} from '@utils';
import {Markup} from 'telegraf';
import {t} from '../../locales/i18n';
import {Action} from '../Action';

class ShowWordsListAction extends Action {
  constructor() {
    super('keyboard.show_words_list');
  }

  async action(ctx: MyContext, lng: string) {
    const id = getUserId(ctx);

    const words = await getWordsList(id);

    console.log(words);

    ctx.reply(
      JSON.stringify(words),
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            t('responses.show_words_list.edit_word.callback', lng),
            'editWord'
          ),
          Markup.button.callback(
            t('responses.show_words_list.delete_word.callback', lng),
            'deleteWord'
          )
        ],
        [
          Markup.button.callback(
            t('responses.show_words_list.export_txt', lng),
            'exportTxt'
          ),
          Markup.button.callback(
            t('responses.show_words_list.export_json', lng),
            'exportJson'
          )
        ]
      ])
    );
  }

  callbackEditWord(ctx: MyContext, lng: string) {
    ctx.reply(t('responses.show_words_list.edit_word.input_original', lng), {
      reply_markup: {
        force_reply: true
      }
    });
  }

  callbackDeleteWord(ctx: MyContext, lng: string) {
    ctx.reply(t('responses.show_words_list.delete_word.input_original', lng), {
      reply_markup: {
        force_reply: true
      }
    });
  }

  callbackExportTxt(ctx: MyContext, lng: string) {
    ctx.reply('export txt');
  }

  callbackExportJson(ctx: MyContext, lng: string) {
    ctx.reply('export json');
  }
}

function getWordsList(userId: number) {
  return pg()
    .selectFrom('words')
    .select(['words.original', 'words.translate', 'correct', 'incorrect'])
    .where('userId', '=', userId)
    .execute();
}

export default ShowWordsListAction;
