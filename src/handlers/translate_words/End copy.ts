// import {pg} from '@connections';
// import {type MyContext, STATES} from '@interfaces/context';
// import {buttonCallback} from '@telefy/callbackButton';
// import {EndHandler} from '@telefy/EndHandler';
// import {getCallback, getUserId} from '@utils';
// import {Markup} from 'telegraf';
// import type {InlineKeyboardButton} from 'telegraf/types';
// import {t} from '../../locales/i18n';

// const getTranslateButton = (original: string) =>
//   Markup.button.url(
//     'Перевод в Google',
//     // TODO: Пока переводит только на русский
//     `https://translate.google.com/?hl=ru&sl=auto&tl=ru&text=${original}&op=translate`
//   );

// const createOptions = (wordFromDb: {correct: number; incorrect: number}) => {
//   return {
//     correct: String(wordFromDb.correct),
//     incorrect: String(wordFromDb.incorrect)
//   };
// };

// class End extends EndHandler {
//   react = STATES.startInputTranslate;

//   async action(ctx: MyContext, lng: string) {
//     const userId = getUserId(ctx);
//     const input = ctx.message.text;
//     const wordId = ctx.session.state.data;

//     ctx.session.state.type = undefined;
//     ctx.session.state.data = undefined;

//     const wordFromDb = await checkCorrectly(input, wordId, userId);

//     if (!wordFromDb) {
//       throw new Error('Word not found in db!');
//     }

//     const translateButton = getTranslateButton(wordFromDb.original);

//     if (input === wordFromDb.translate) {
//       ctx.reply(
//         t('responses.translate_word.correct', lng, createOptions(wordFromDb)),
//         Markup.inlineKeyboard([[translateButton], [nextButton(lng)]])
//       );

//       return;
//     }

//     ctx.session.action = wordId;

//     const sent = ctx.reply(
//       t('responses.translate_word.incorrect', lng, createOptions(wordFromDb)),
//       Markup.inlineKeyboard([
//         [translateButton],
//         [buttonCallback('Ответ правильный', 'answer_correct', answerCorrect)],
//         [nextButton(lng)]
//       ])
//     );

//     const messageId = (await sent).message_id;

//     ctx.session.last_message_id = messageId;

//     setAfterCallback(ctx, messageId, translateButton);
//   }
// }

// async function setAfterCallback(
//   ctx: MyContext,
//   messageId: number,
//   translateButton: InlineKeyboardButton.UrlButton
// ) {
//   ctx.session.afterCallback = async () => {
//     await ctx.telegram.editMessageReplyMarkup(
//       ctx.chat?.id,
//       messageId,
//       undefined,
//       Markup.inlineKeyboard([translateButton]).reply_markup
//     );
//   };
// }

// function nextButton(lng: string) {
//   return buttonCallback(
//     t('next', lng),
//     'next',
//     getCallback(STATES.startTranslateWord)
//   );
// }

// async function answerCorrect(ctx: MyContext, lng: string) {
//   const last_message_id = ctx.session.last_message_id;
//   const wordId = ctx.session.action;
//   const userId = getUserId(ctx);
//   console.log('SENT ID', last_message_id);
//   const correctUpdate = await setIsCorrect(wordId, userId);

//   if (!correctUpdate) {
//     throw new Error('No correct update word');
//   }

//   if (!last_message_id) {
//     throw new Error('last_message_id not found');
//   }

//   const translateButton = getTranslateButton(correctUpdate.original);

//   setAfterCallback(ctx, last_message_id, translateButton);

//   await ctx.telegram.editMessageText(
//     ctx.chat?.id,
//     last_message_id,
//     undefined,
//     t('responses.translate_word.correct', lng, createOptions(correctUpdate)),
//     Markup.inlineKeyboard([
//       [getTranslateButton(correctUpdate.original)],
//       [nextButton(lng)]
//     ])
//   );
// }

// function checkCorrectly(input: string, wordId: number, userId: number) {
//   return pg()
//     .updateTable('words')
//     .where('userId', '=', userId)
//     .where('wordId', '=', wordId)
//     .set((qb) => ({
//       correct: qb
//         .case()
//         .when(qb('translate', '=', input))
//         .then(qb('correct', '+', 1))
//         .else(qb.ref('correct'))
//         .end(),

//       incorrect: qb
//         .case()
//         .when(qb('translate', '!=', input))
//         .then(qb('incorrect', '+', 1))
//         .else(qb.ref('incorrect'))
//         .end()
//     }))
//     .returning(['original', 'translate', 'correct', 'incorrect'])
//     .executeTakeFirst();
// }

// function setIsCorrect(wordId: number, userId: number) {
//   return pg()
//     .updateTable('words')
//     .where('userId', '=', userId)
//     .where('wordId', '=', wordId)
//     .set((qb) => ({
//       correct: qb('correct', '+', 1),
//       incorrect: qb('incorrect', '-', 1)
//     }))
//     .returning(['original', 'correct', 'incorrect'])
//     .executeTakeFirst();
// }

// export default End;
