import type {MyContext} from '@interfaces/context';
import {getLng} from '@utils';
import type {Telegraf} from 'telegraf';

class ActionsManager {
  private readonly actions = new Set<string>();
  private bot?: Telegraf<MyContext>;

  public create(bot: Telegraf<MyContext>) {
    this.bot = bot;
  }

  public register(
    id: string,
    callback: (ctx: MyContext, lng: string) => void
  ): void {
    if (!this.bot) {
      throw new Error('Actions manager not initialized');
    }

    if (this.actions.has(id)) {
      return;
    }

    this.bot.action(id, (ctx) => {
      const lng = getLng(ctx);
      callback(ctx, lng);
    });
    this.actions.add(id);
  }
}

export default new ActionsManager();
