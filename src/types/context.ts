import type {Context} from 'telegraf';

// export type SessionWord = UnwrapColumn<
//   Omit<Words, 'id'> & Pick<Words, 'wordId' | 'correct' | 'incorrect'>
// >;

interface SessionData {
  originalWord?: string;
  wordIdForTranslate?: number;
}

export type MyContext = Context & {session: SessionData};
