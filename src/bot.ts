import {connect, pg} from './connections';

connect();

console.log(await pg().selectFrom('users').selectAll().execute());

// import {Telegraf} from 'telegraf';

// const bot = new Telegraf(process.env.BOT_KEY);

// bot.start((ctx) => {
//   ctx.reply('Привет! Я бот на Telegraf с TypeScript.');
// });

// bot.on('text', (ctx) => {
//   ctx.reply(`Вы написали: ${ctx.message.text}`);
// });

// bot.launch().then(() => {
//   console.log('Бот запущен');
// });

// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));
