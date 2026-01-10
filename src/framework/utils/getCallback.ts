import type {MyContext, States} from '@interfaces/context';
import type {TextCommands} from '@interfaces/utils';
import {t} from '../../locales/i18n';

const getCallback = (state: States, textCommand: TextCommands) => {
  return (ctx: MyContext, lng: string) => {
    ctx.session.state.type = state;

    ctx.reply(t(textCommand, lng));
  };
};

export default getCallback;
