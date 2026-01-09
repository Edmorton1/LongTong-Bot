import {type MyContext, STATES} from '@interfaces/context';
import {StartHandler} from '@telefy/StartHandler';
import {t} from '../../locales/i18n';

class Start extends StartHandler {
  next = STATES.loadDictionary;

  constructor() {
    super({
      command: 'load_dictionary',
      text: 'keyboard.load_dictionary'
    });
  }

  action(ctx: MyContext, lng: string) {
    ctx.session.state.type = 'state_load_dictionary';

    ctx.reply(t('responses.load_dictionary.info', lng));
  }
}

export default Start;
