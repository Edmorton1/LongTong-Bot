import {logger} from '@connections';
import {COMMANDS} from '@interfaces/commands';
import type {MyContext} from '@interfaces/context';
import ActionsManager from '@telefy/ActionsManager';
import {allHandlers} from '@telefy/allHandlers';
import type {EndHandler} from '@telefy/EndHandler';
import type {IntermediateHandler} from '@telefy/IntermediateHandler';
import {loadDirectories} from '@telefy/loadDirectories';
import {getMenu} from '@telefy/Menu';
import {getLng} from '@utils';
import {session, type Telegraf} from 'telegraf';
import {message} from 'telegraf/filters';
import {t} from '../locales/i18n';

function setCommands(bot: Telegraf<MyContext>, lngs: string[]) {
  for (const lng of lngs) {
    bot.telegram.setMyCommands(
      [
        {command: COMMANDS.START, description: t('start', lng)},
        {
          command: COMMANDS.REMEMBER_WORD,
          description: t('keyboard.remember_word', lng)
        },
        {
          command: COMMANDS.SHOW_DICTIONARY,
          description: t('keyboard.show_dictionary', lng)
        },
        {
          command: COMMANDS.TRANSLATE_WORD,
          description: t('keyboard.start', lng)
        }
      ],
      {language_code: lng}
    );
  }
}

function useAfterCallback(ctx: MyContext) {
  if (ctx.session.afterCallback) {
    ctx.session.afterCallback();
    ctx.session.afterCallback = undefined;
  }
}

export const start = async (bot: Telegraf<MyContext>) => {
  ActionsManager.create(bot);

  await loadDirectories(__dirname);

  // setCommands(bot, ['en', 'ru']);

  bot.use(
    session({
      defaultSession: () => ({
        state: {},
        last_message_id: 0
      })
    })
  );

  bot.start((ctx) => {
    const lng = getLng(ctx);
    const name = ctx.from.first_name;

    const menu = getMenu(lng);
    ctx.reply(t('welcome', lng, {name}), menu);
  });

  bot.command('abort', (ctx) => {
    const lng = getLng(ctx);

    ctx.session.state = {};

    ctx.reply(t('abort.aborted', lng));
  });

  for (const handler of allHandlers.start) {
    bot.command(handler.command.command, handler.run.bind(handler));
  }

  bot.on(message('text'), (ctx) => {
    const state = ctx.session.state;

    useAfterCallback(ctx);

    if (state.type) {
      console.log({type: state.type});

      const handle: IntermediateHandler | EndHandler | undefined = [
        ...allHandlers.intermediate,
        ...allHandlers.end
      ].find((handler) => handler.react === state.type);

      if (!handle) {
        throw new Error('Not existed callback');
      }

      handle.run(ctx);
      return;
    }
    const lng = getLng(ctx);

    const handler = allHandlers.start.find(
      (handle) => t(handle.command.text, lng) === ctx.message.text
    );

    if (!handler) {
      ctx.reply(t('unknown', lng));
      return;
    }

    handler.run(ctx);
  });

  bot.launch(() => logger().info('BOT STARTED'));

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
