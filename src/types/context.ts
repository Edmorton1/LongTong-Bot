import type {DB} from '@domain';
import type {Context} from 'telegraf';
import type {UnwrapColumn} from './utils';

export type SessionWord = UnwrapColumn<
  Omit<DB['words'], 'id'> &
    Pick<DB['relations'], 'wordId' | 'correct' | 'incorrect'>
>;

interface SessionData {
  originalWord?: string;
  words?: SessionWord[];
  originalForTranslateChange?: string;
}

export type MyContext = Context & {session: SessionData};
