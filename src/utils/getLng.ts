import type {MyContext} from '@interfaces/context';

function getLng(ctx: MyContext) {
  return ctx.from?.language_code ?? 'en';
}

export default getLng;
