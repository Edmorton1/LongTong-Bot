import {pg} from '@connections';
import {COMMANDS} from '@interfaces/commands';
import {type MyContext, STATES} from '@interfaces/context';
import {buttonCallback} from '@telefy/callbackButton';
import {StartHandler} from '@telefy/handlers/StartHandler';
import {getCallback, getUserId} from '@telefy/utils';
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
    const userId = getUserId(ctx);

    const chunks = (await getWordsList(userId)).map((e) => {
      const text = e.chunk_text;
      if (typeof text !== 'string') {
        throw new Error('Typeof text is not string');
      }
      return text;
    });

    const lastChunk = chunks.pop();

    if (!lastChunk) {
      ctx.reply(t('responses.show_dictionary.words_empty'));
      return;
    }

    for (const chunk of chunks) {
      await ctx.reply(chunk);
    }

    ctx.reply(
      lastChunk,
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
    .with('words_ordered', (qb) =>
      qb
        .selectFrom('words')
        .select([
          sql`original || ' - ' || translate`.as('pair'),
          sql`LENGTH(original || ' - ' || translate)`.as('len'),
          'updatedAt'
        ])
        .where('userId', '=', userId)
        .orderBy('updatedAt')
    )
    .with('cumulative', (qb) =>
      qb
        .selectFrom('words_ordered')
        .selectAll()
        .select(
          sql`SUM(len + 1) OVER (ORDER BY "updatedAt" ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`.as(
            'cum_len'
          )
        )
    )
    .with('chunks', (qb) =>
      qb
        .selectFrom('cumulative')
        .selectAll()
        .select(sql`FLOOR((cum_len - 1) / 4000)`.as('chunk_id'))
    )
    .selectFrom('chunks')
    .select(sql`STRING_AGG(pair, E'\n')`.as('chunk_text'))
    .groupBy('chunk_id')
    .orderBy('chunk_id')
    .execute();
}

export default Start;
