import type {States} from '@interfaces/context';
import {Handler} from './Handler';

export abstract class EndHandler extends Handler {
  public abstract react: States;

  constructor() {
    super(undefined);
  }
}
