import {pg} from '@connections';
import type {MyContext} from '@interfaces/context';
import {getUserId} from '@utils';
import {Markup} from 'telegraf';
import {t} from '../../locales/i18n';
import {Action} from '../Action';

const getTranslateButton = (original: string) =>
  Markup.button.url(
    'Перевод в Google',
    // TODO: Добавить язык
    `https://translate.google.com/?hl=ru&sl=auto&tl=ru&text=${original}&op=translate`
  );

class InputTranslateAction extends Action {
  constructor() {
    super('state_start_input_translate');
  }

  async action(ctx: MyContext, lng: string) {
    const userId = getUserId(ctx);
    const input = ctx.message.text;
    const wordId = ctx.session.startWordId;

    ctx.session.state = undefined;
    ctx.session.startWordId = undefined;

    if (!wordId) {
      throw new Error('Word not found!');
    }

    const wordFromDb = await checkCorrectly(input, wordId, userId);

    console.log({
      translInput: input,
      transl2: wordFromDb?.translate
    });

    if (!wordFromDb) {
      throw new Error('Word not found in db!');
    }

    const options = {
      correct: String(wordFromDb.correct),
      incorrect: String(wordFromDb.incorrect)
    };

    const translateButton = getTranslateButton(wordFromDb.original);

    if (input === wordFromDb.translate) {
      ctx.reply(
        t('responses.start.correct', lng, options),
        Markup.inlineKeyboard([translateButton])
      );

      return;
    }

    const sent = ctx.reply(
      t('responses.start.incorrect', lng, options),
      Markup.inlineKeyboard([
        [translateButton],
        [Markup.button.callback('Ответ правильный', 'answerCorrect')]
      ])
    );

    ctx.session.afterCallback = async () => {
      await ctx.telegram.editMessageReplyMarkup(
        ctx.chat?.id,
        (await sent).message_id,
        undefined,
        Markup.inlineKeyboard([translateButton]).reply_markup
      );
    };

    // ctx.reply(
    //   'asdasd',
    //   Markup.keyboard([['Ответ правильный'], [t('keyboard.start', lng)]])
    // );
  }

  async callbackAnswerCorrect(ctx: MyContext, lng: string) {
    ctx.reply('asdasd');
  }

  // TODO: Добавить функцию которая чё-то делает после отправки сообщения например чистит инлайны
}

function checkCorrectly(input: string, wordId: number, userId: number) {
  return pg()
    .updateTable('words')
    .where('userId', '=', userId)
    .where('wordId', '=', wordId)
    .set((qb) => ({
      correct: qb
        .case()
        .when(qb('translate', '=', input))
        .then(qb('correct', '+', 1))
        .else(qb.ref('correct'))
        .end(),

      incorrect: qb
        .case()
        .when(qb('translate', '!=', input))
        .then(qb('incorrect', '+', 1))
        .else(qb.ref('incorrect'))
        .end()
    }))
    .returning(['original', 'translate', 'correct', 'incorrect'])
    .executeTakeFirst();
}

export default InputTranslateAction;
