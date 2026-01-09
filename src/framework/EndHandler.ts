import type {MyContext, States} from '@interfaces/context';
import {getLng} from '@utils';
import {t} from '../locales/i18n';
import {Handler} from './Handler';
import {getMenu} from './Menu';

export abstract class EndHandler extends Handler {
  public abstract react: States;

  constructor() {
    super(undefined);
  }

  public override async run(ctx: MyContext) {
    const lng = getLng(ctx);

    const menu = getMenu(lng);

    await this.action(ctx, lng);
    ctx.reply(t('choose_handler', lng), menu);
  }
}
