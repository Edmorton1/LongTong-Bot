import type {States} from '@interfaces/context';
import type {TextCommands} from '@interfaces/utils';
import {type Commands, Handler} from './Handler';

export abstract class StartHandler extends Handler {
  public abstract next?: States;

  constructor(
    public override command: {
      text: TextCommands;
      command: Commands;
    }
  ) {
    super(command);
  }
}
