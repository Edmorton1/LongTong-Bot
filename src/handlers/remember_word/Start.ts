import {type MyContext, STATES} from '@interfaces/context';
import {StartHandler} from '@telefy/handlers/StartHandler';
import {t} from '../../locales/i18n';

class Start extends StartHandler {
  next = STATES.rememberWordOriginal;

  constructor() {
    super({command: 'remember_word', text: 'keyboard.remember_word'});
  }

  action(ctx: MyContext, lng: string) {
    ctx.session.state.type = this.next;

    ctx.reply(t('responses.remember_word.input_original', lng));
  }
}

export default Start;
