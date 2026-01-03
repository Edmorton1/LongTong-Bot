import { Markup } from 'telegraf';
import { t } from './locales/i18n';

export const replyKeyboard = (lng: string) => {
  return Markup.keyboard([
    [t('keyboard.start', lng)],
    [t('keyboard.remember_word', lng), t('keyboard.load_word_dictionary', lng)],
    [t('keyboard.show_words_list', lng), t('keyboard.change_language', lng)],
  ])
    .resize()
    .oneTime(false);
};
