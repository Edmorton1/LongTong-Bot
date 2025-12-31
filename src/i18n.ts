import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import type keys from './locales/en/main.json';

i18next.use(Backend).init({
  fallbackLng: 'en',
  backend: {
    loadPath: `${__dirname}/locales/{{lng}}/main.json`
  },
  initAsync: false
});

i18next.loadLanguages('ru');

export const i18n = i18next;

type Flatten<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? Flatten<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

export type Commands = Flatten<typeof keys>;

export function t<K extends Flatten<typeof keys>>(
  key: K,
  lng: string = 'en',
  options?: Record<string, string>
): string {
  return i18n.t(key, {...options, lng});
}
