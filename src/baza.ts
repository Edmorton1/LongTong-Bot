import {pg} from '@connections';

export const saveUser = (id: number) => {
  return pg()
    .insertInto('users')
    .values({id})
    .onConflict((qb) => qb.doNothing())
    .execute();
};
