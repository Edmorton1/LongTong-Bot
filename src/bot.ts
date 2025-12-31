import {connect, logger} from '@connections';
import type {MyContext} from '@interfaces/context';
import {getEnv} from '@utils';
import {Markup, session, Telegraf} from 'telegraf';
import {message} from 'telegraf/filters';
import {actions} from './actions';
import {saveUser, saveWordAndCreateRelation} from './baza';
import {t} from './locales/i18n';

connect();

console.log(actions);

const bot = new Telegraf<MyContext>(getEnv('BOT_KEY'));

bot.use(session({defaultSession: () => ({})}));

bot.start(async (ctx) => {
  const {id, first_name: name, language_code: lng} = ctx.from;

  await saveUser({id, name});

  await ctx.reply(
    t('welcome', lng, {name}),
    Markup.keyboard([
      [t('keyboard.start', lng)],
      [
        t('keyboard.remember_word', lng),
        t('keyboard.load_word_dictionary', lng)
      ],
      [t('keyboard.show_words_list', lng)]
    ])
      .resize()
      .oneTime(false)
  );
});

bot.on(message('text'), async (ctx) => {
  const {id: userId, language_code: lng} = ctx.from;

  if (ctx.message.reply_to_message) {
    const original = ctx.message.reply_to_message.text;
    switch (original) {
      case t('responses.start.input_original', lng):
        ctx.session.originalWord = ctx.message.text;
        ctx.reply(t('responses.start.input_translate', lng), {
          reply_markup: {
            force_reply: true
          }
        });
        return;
      case t('responses.start.input_translate', lng): {
        const original = ctx.session.originalWord;

        if (!original) {
          ctx.reply(t('responses.start.input_original', lng));
          return;
        }

        const translate = ctx.message.text;

        await saveWordAndCreateRelation({userId, original, translate});

        ctx.reply(
          t('responses.start.word_saved', lng, {
            original,
            translate
          })
        );
      }
    }
  }

  switch (ctx.message.text) {
    case t('keyboard.start', lng):
      ctx.reply('start');
      return;
    case t('keyboard.remember_word', lng):
      ctx.reply(t('responses.start.input_original', lng), {
        reply_markup: {
          force_reply: true
        }
      });
      return;
    case t('keyboard.load_word_dictionary', lng):
      ctx.reply('word dictionary');
      return;
    case t('keyboard.show_words_list', lng):
      ctx.reply('asdasdasd');
      return;
    default:
      ctx.reply('Не понял чё ты написал');
  }
});

bot.launch(() => logger().info('BOT STARTED'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
