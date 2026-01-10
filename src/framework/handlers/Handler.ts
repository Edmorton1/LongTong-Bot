import type {COMMANDS} from '@interfaces/commands';
import type {MyContext} from '@interfaces/context';
import type {TextCommands} from '@interfaces/utils';
import {getLng} from '@telefy/utils';

export type Commands = (typeof COMMANDS)[keyof typeof COMMANDS];

export abstract class Handler {
  constructor(
    public command: {text: TextCommands; command: Commands} | undefined
  ) {}

  protected abstract action(ctx: MyContext, lng: string): void | Promise<void>;

  public run(ctx: MyContext) {
    const lng = getLng(ctx);
    this.action(ctx, lng);
  }
}
