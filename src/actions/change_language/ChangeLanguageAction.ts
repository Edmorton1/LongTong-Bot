import type { MyContext } from '@interfaces/context';
import { Action } from '../Action';
import { t } from '../../locales/i18n';
import { Markup } from 'telegraf';
import { replyKeyboard } from '../../temp';

class ChangeLanguageAction extends Action {
  constructor() {
    super('keyboard.change_language');
  }

  action(ctx: MyContext, lng: string) {
    console.log('accept');

    ctx.reply(
      t('responses.change_language.select_language', lng),
      Markup.inlineKeyboard([
        Markup.button.callback('🇺🇸 English', 'langEn'),
        Markup.button.callback('🇷🇺 Русский', 'langRu'),
      ]),
    );
  }

  callbackLangEn(ctx: MyContext) {
    console.log('asdasd');
    const lng = 'en';

    ctx.session.lng = lng;
    ctx.reply('Language changed', replyKeyboard(lng));
  }

  callbackLangRu(ctx: MyContext) {
    console.log('asdasd');
    const lng = 'ru';

    ctx.session.lng = lng;
    ctx.reply('Язык изменён', replyKeyboard(lng));
  }
}

export default ChangeLanguageAction;
