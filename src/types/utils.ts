import type {ColumnType, Generated} from 'kysely';
import type keys from '../locales/en/main.json';

export type Flatten<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? Flatten<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

export type UnwrapColumns<T> =
  T extends ColumnType<infer S, any, any>
    ? UnwrapColumns<S>
    : T extends Generated<infer S>
      ? UnwrapColumns<S>
      : T extends Array<infer U>
        ? UnwrapColumns<U>[]
        : T extends object
          ? {[K in keyof T]: UnwrapColumns<T[K]>}
          : T;

export type TextCommands = Flatten<typeof keys>;
