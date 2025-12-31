import type {Commands} from '@interfaces/utils';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';

i18next.use(Backend).init({
  fallbackLng: 'en',
  backend: {
    loadPath: `${__dirname}/{{lng}}/main.json`
  },
  initAsync: false
});

i18next.loadLanguages('ru');

export function t<K extends Commands>(
  key: K,
  lng: string = 'en',
  options?: Record<string, string>
): string {
  return i18next.t(key, {...options, lng});
}
