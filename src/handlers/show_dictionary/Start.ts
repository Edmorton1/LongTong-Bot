import {pg} from '@connections';
import {COMMANDS} from '@interfaces/commands';
import {type MyContext, STATES, type States} from '@interfaces/context';
import type {TextCommands} from '@interfaces/utils';
import {buttonCallback} from '@telefy/callbackButton';
import {StartHandler} from '@telefy/StartHandler';
import {getUserId} from '@utils';
import {Markup} from 'telegraf';
import {t} from '../../locales/i18n';

class Start extends StartHandler {
  next = undefined;

  constructor() {
    super({
      command: COMMANDS.SHOW_DICTIONARY,
      text: 'keyboard.show_dictionary'
    });
  }

  async action(ctx: MyContext, lng: string) {
    const id = getUserId(ctx);

    const words = await getWordsList(id);

    if (!words.length) {
      ctx.reply(t('responses.show_dictionary.words_empty', lng));
      return;
    }

    const asd = words
      .map(
        (qwe) =>
          `${qwe.original} - ${qwe.translate}\n${t('words.correct', lng)}: ${qwe.correct}\n${t('words.incorrect', lng)}: ${qwe.incorrect}`
      )
      .join('\n\u200B\n');

    ctx.reply(
      asd,
      Markup.inlineKeyboard([
        [
          buttonCallback(
            t('responses.show_dictionary.edit_word.callback', lng),
            'editWord',
            getCallback(
              STATES.changeTranslateOriginal,
              'responses.show_dictionary.edit_word.input_original'
            )
          ),
          buttonCallback(
            t('responses.show_dictionary.delete_word.callback', lng),
            'deleteWord',
            getCallback(
              STATES.deleteWord,
              'responses.show_dictionary.delete_word.input_original'
            )
          )
        ],
        [
          Markup.button.callback(
            t('responses.show_dictionary.export_txt', lng),
            'exportTxt'
          ),
        ]
      ])
    );
  }
}

function getCallback(state: States, textCommand: TextCommands) {
  return (ctx: MyContext, lng: string) => {
    ctx.session.state.type = state;

    ctx.reply(t(textCommand, lng));
  };
}

function getWordsList(userId: number) {
  return pg()
    .selectFrom('words')
    .select(['words.original', 'words.translate', 'correct', 'incorrect'])
    .where('userId', '=', userId)
    .execute();
}

export default Start;
