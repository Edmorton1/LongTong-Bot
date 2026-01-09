import {Markup} from 'telegraf';
import {t} from '../locales/i18n';
import {allHandlers} from './allHandlers';

export const getMenu = (lng: string) => {
  const [remember_word, show_dictionary, load_dict, start] =
    allHandlers.start.map((e) => t(e.command.text, lng));

  if (!remember_word || !show_dictionary || !load_dict || !start) {
    throw new Error('Invalid menu configuration');
  }

  return Markup.keyboard([
    [start],
    [remember_word, show_dictionary],
    [load_dict]
  ])
    .resize()
    .oneTime(false);
};
