import {Markup} from 'telegraf';
import {t} from '../locales/i18n';
import {allHandlers} from './handlers/allHandlers';

export const getMenu = (lng: string) => {
  const [remember_word, show_dictionary, load_dict, translate_word] =
    allHandlers.start.map((e) => t(e.command.text, lng));

  if (!remember_word || !show_dictionary || !load_dict || !translate_word) {
    throw new Error('Invalid menu configuration');
  }

  return Markup.keyboard([
    [translate_word],
    [remember_word, show_dictionary],
    [load_dict]
  ])
    .resize()
    .oneTime(false);
};
