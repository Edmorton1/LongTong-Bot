import {connect} from '@connections';
import type {MyContext} from '@interfaces/context';
import {getEnv} from '@utils';
import {Telegraf} from 'telegraf';
import {start} from './handlers/index';

connect();

const bot = new Telegraf<MyContext>(getEnv('BOT_KEY'));

start(bot);

// bot.start(async (ctx) => {
//   const {id, first_name: name} = ctx.from;

//   // TODO: Дублирование убрать
//   const lng = getLng(ctx);

//   await pg()
//     .insertInto('users')
//     .values({id})
//     .onConflict((qb) => qb.doNothing())
//     .execute();

//   await ctx.reply(
//     t('welcome', lng, {name}),
//     Markup.keyboard([
//       [t('keyboard.start', lng)],
//       [
//         t('keyboard.remember_word', lng),
//         t('keyboard.load_word_dictionary', lng)
//       ],
//       [t('keyboard.show_dictionary', lng)]
//     ])
//       .resize()
//       .oneTime(false)
//   );
// });

// bot.on(message('text'), async (ctx) => {
//   useAfterCallback(ctx);
//   const lng = getLng(ctx);

//   const {state} = ctx.session;

//   if (state) {
//     const action = actions.find((action) => action.command === state);

//     if (action) {
//       action.run(ctx);
//       return;
//     }
//   }

//   const action = actions.find(
//     (action) => t(action.command, lng) === ctx.message.text
//   );

//   if (action) {
//     action.run(ctx);
//     return;
//   }

//   ctx.reply('Не понял чё ты написал');
// });

// for (const callback of callbacks) {
//   const {name, handler} = callback;

//   bot.action(name, (ctx) => {
//     useAfterCallback(ctx);
//     handler(ctx, ctx.from.language_code ?? 'en');
//   });
// }

// bot.launch(() => logger().info('BOT STARTED'));

// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));
