import type {ColumnType, Generated} from 'kysely';
import type keys from '../locales/en/main.json';

export type Flatten<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? Flatten<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

export type UnwrapColumn<T> =
  T extends ColumnType<infer S, any, any>
    ? UnwrapColumn<S>
    : T extends Generated<infer S>
      ? UnwrapColumn<S>
      : T extends Array<infer U>
        ? UnwrapColumn<U>[]
        : T extends object
          ? {[K in keyof T]: UnwrapColumn<T[K]>}
          : T;

export type Commands = Flatten<typeof keys>;
