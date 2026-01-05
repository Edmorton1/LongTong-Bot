import type {MyContext} from '@interfaces/context';
import {refreshWordList} from '@utils';
import {Markup} from 'telegraf';
import {t} from '../../locales/i18n';
import {Action} from '../Action';

class ShowWordsListAction extends Action {
  constructor() {
    super('keyboard.show_words_list');
  }

  async action(ctx: MyContext, lng: string) {
    const id = ctx.from?.id;

    if (!id) {
      throw new Error('Not have id from context');
    }

    const words = await refreshWordList(ctx, id);

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
            t('responses.show_words_list.delete_word', lng),
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
    ctx.reply('delete word');
  }

  callbackExportTxt(ctx: MyContext, lng: string) {
    ctx.reply('export txt');
  }

  callbackExportJson(ctx: MyContext, lng: string) {
    ctx.reply('export json');
  }
}

export default ShowWordsListAction;
