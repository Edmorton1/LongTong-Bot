import { connect, logger } from '@connections';
import type { MyContext } from '@interfaces/context';
import { getEnv } from '@utils';
import { Markup, session, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { actions, callbacks } from './actions';
import { saveUser } from './baza';
import { t } from './locales/i18n';

connect();

const bot = new Telegraf<MyContext>(getEnv('BOT_KEY'));

bot.use(session({ defaultSession: () => ({}) }));

bot.start(async (ctx) => {
  const { id, first_name: name } = ctx.from;

  // TODO: Дублирование убрать
  const lng = ctx.from?.language_code ?? 'en';

  await saveUser({ id, name });

  await ctx.reply(
    t('welcome', lng, { name }),
    Markup.keyboard([
      [t('keyboard.start', lng)],
      [
        t('keyboard.remember_word', lng),
        t('keyboard.load_word_dictionary', lng),
      ],
      [t('keyboard.show_words_list', lng)],
    ])
      .resize()
      .oneTime(false),
  );
});

bot.on(message('text'), async (ctx) => {
  console.log(ctx.session);
  const lng = ctx.from?.language_code ?? 'en';

  if (ctx.message.reply_to_message) {
    const original = ctx.message.reply_to_message.text;

    const action = actions.find(
      (action) => t(action.command, lng) === original,
    );

    if (action) {
      action.run(ctx);
      return;
    }
  }

  const action = actions.find(
    (action) => t(action.command, lng) === ctx.message.text,
  );

  console.log(
    ctx.message.text,
    actions.map((e) => e.command),
  );

  if (action) {
    action.run(ctx);
    return;
  }

  ctx.reply('Не понял чё ты написал');
});

console.log({ callbacks });

for (const callback of callbacks) {
  const { name, handler } = callback;

  bot.action(name, handler);
}

bot.launch(() => logger().info('BOT STARTED'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
