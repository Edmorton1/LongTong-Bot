import {pg} from '@connections';
import type {Users, Words} from '@domain';

export const saveUser = (user: Users) => {
  return pg()
    .insertInto('users')
    .values(user)
    .onConflict((qb) => qb.doNothing())
    .execute();
};

export const saveWordAndCreateRelation = (
  word: {userId: Users['id']} & Omit<Words, 'id'>
) => {
  const {userId, ...wordDto} = word;

  return pg()
    .transaction()
    .execute(async (trx) => {
      const {id: wordId} = await trx
        .insertInto('words')
        .values(wordDto)
        .returning('id')
        .executeTakeFirstOrThrow();

      await trx.insertInto('relations').values({userId, wordId}).execute();
    });
};
