import type {MyContext} from '@interfaces/context';
import {Markup} from 'telegraf';
import ActionsManager from './ActionsManager';

export const buttonCallback = (
  text: string,
  id: string,
  callback: (ctx: MyContext, lng: string) => void
) => {
  console.log('EMIT', {id, text, callback});
  ActionsManager.register(id, callback);

  return Markup.button.callback(text, id);
};
