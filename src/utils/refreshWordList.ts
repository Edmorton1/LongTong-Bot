import {pg} from '@connections';
import type {MyContext} from '@interfaces/context';

async function refreshWordList(ctx: MyContext, userId: number) {
  let words = ctx.session.words;

  if (words) {
    return words;
  }

  words = await pg()
    .selectFrom('relations')
    .innerJoin('words', 'words.id', 'relations.wordId')
    .select([
      'wordId',
      'words.original',
      'words.translate',
      'correct',
      'incorrect'
    ])
    .where('relations.userId', '=', userId)
    .execute();

  ctx.session.words = words;

  return words;
}

export default refreshWordList;
