import {type MyContext, STATES, type States} from '@interfaces/context';
import {StartHandler} from '@telefy/StartHandler';

class Start extends StartHandler {
  // next = STATES.

  constructor() {
    super({
      command: 'load_dictionary',
      text: 'keyboard.load_word_dictionary'
    });
  }

  action(ctx: MyContext, lng: string) {
    ctx.reply('mock word dictionary');
  }
}

export default Start;
