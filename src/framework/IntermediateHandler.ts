import type {States} from '@interfaces/context';
import {Handler} from './Handler';

export abstract class IntermediateHandler extends Handler {
  public abstract react: States;
  public abstract next: States;

  constructor() {
    super(undefined);
  }
}
