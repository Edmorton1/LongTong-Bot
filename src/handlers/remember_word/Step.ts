import {type MyContext, STATES} from '@interfaces/context';
import {IntermediateHandler} from '@telefy/handlers/IntermediateHandler';
import {t} from '../../locales/i18n';

class Step extends IntermediateHandler {
  react = STATES.rememberWordOriginal;
  next = STATES.rememberWordTranslate;

  action(ctx: MyContext, lng: string) {
    ctx.session.state.type = this.next;
    ctx.session.state.data = ctx.message.text;

    ctx.reply(t('responses.remember_word.input_translate', lng));
  }
}

export default Step;
