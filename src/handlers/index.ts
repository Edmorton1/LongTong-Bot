import {logger} from '@connections';
import {COMMAND_DESCRIPTIONS, COMMANDS} from '@interfaces/commands';
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

// ^.+ [\-–—] .+$

async function setCommands(bot: Telegraf<MyContext>, lngs: string[]) {
  for (const lng of lngs) {
    await bot.telegram.setMyCommands(
      Object.keys(COMMANDS).map((key) => ({
        command: COMMANDS[key],
        description: t(COMMAND_DESCRIPTIONS[key], lng)
      })),
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

function useState(ctx: MyContext) {
  const state = ctx.session.state;

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
    return true;
  }
  return false;
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

    useAfterCallback(ctx);

    const menu = getMenu(lng);

    ctx.reply(t('abort.aborted', lng), menu);
  });

  for (const handler of allHandlers.start) {
    bot.command(handler.command.command, handler.run.bind(handler));
  }

  bot.on(message('text'), (ctx) => {
    useAfterCallback(ctx);

    if (useState(ctx)) return;

    const lng = getLng(ctx);

    const handler = allHandlers.start.find(
      (handle) => t(handle.command.text, lng) === ctx.message.text
    );

    if (!handler) {
      const menu = getMenu(lng);
      ctx.reply(t('unknown', lng), menu);
      return;
    }

    handler.run(ctx);
  });

  bot.on(message('document'), async (ctx) => {
    if (useState(ctx)) return;
  });

  bot.launch(() => logger().info('BOT STARTED'));

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
