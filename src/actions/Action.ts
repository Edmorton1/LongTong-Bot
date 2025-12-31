import type {MyContext} from '@interfaces/context';
import type {Commands} from '@interfaces/utils';

export abstract class Action {
  constructor(
    public command: Commands,
    public type: 'action' | 'reply'
  ) {}

  abstract action(ctx: MyContext): void;
}
