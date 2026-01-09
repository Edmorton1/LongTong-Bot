import type {MyContext} from '@interfaces/context';

export function getUserId(ctx: MyContext) {
  const id = ctx.from?.id;

  if (!id) {
    throw new Error('Not have id from context');
  }

  return id;
}

export default getUserId;
