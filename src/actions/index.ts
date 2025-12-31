import type {MyContext} from '../bot';
import type {Commands} from '../i18n';

export class Actions {
  public commands: Commands[] = [];

  protected bindCommands = (ara: {
    command: Commands;
    action: (ctx: MyContext) => void;
  }) => {};
}
