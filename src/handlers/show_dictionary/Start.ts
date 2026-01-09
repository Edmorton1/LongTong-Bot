import {pg} from '@connections';
import {COMMANDS} from '@interfaces/commands';
import {type MyContext, STATES} from '@interfaces/context';
import {buttonCallback} from '@telefy/callbackButton';
import {StartHandler} from '@telefy/StartHandler';
import {getCallback, getUserId} from '@utils';
import {sql} from 'kysely';
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
            'changeTranslate',
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
          buttonCallback(
            t('responses.show_dictionary.export_txt', lng),
            'exportTxt',
            exportTxtCallback
          )
        ]
      ])
    );
  }
}

const getTxt = async (userId: number) => {
  const text = (
    await pg()
      .selectFrom(
        pg()
          .selectFrom('words')
          .select(
            sql`STRING_AGG(original || ' - ' || translate, E'\n')`.as(
              'daily_words'
            )
          )
          .where('userId', '=', userId)
          .groupBy(sql`"updatedAt"::date`)
          .orderBy(sql`"updatedAt"::date`)
          .as('daily')
      )
      .select(sql`STRING_AGG(daily_words, E'\n\n')`.as('all_words'))
      .executeTakeFirst()
  )?.all_words;

  if (!text) {
    throw new Error('Word list-string is empty');
  }

  if (typeof text !== 'string') {
    throw new Error('Typeof text is not a string');
  }

  return text;
};

async function exportTxtCallback(ctx: MyContext) {
  const userId = getUserId(ctx);

  const text = await getTxt(userId);

  const buffer = Buffer.from(text, 'utf-8');

  ctx.replyWithDocument({
    source: buffer,
    filename: 'dict.txt'
  });
}

function getWordsList(userId: number) {
  return pg()
    .selectFrom('words')
    .select(['words.original', 'words.translate', 'correct', 'incorrect'])
    .where('userId', '=', userId)
    .execute();
}

export default Start;
