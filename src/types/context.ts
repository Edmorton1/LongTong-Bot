import type {Context} from 'telegraf';

// export type SessionWord = UnwrapColumn<
//   Omit<Words, 'id'> & Pick<Words, 'wordId' | 'correct' | 'incorrect'>
// >;

type states =
  | 'state_remember_word_original'
  | 'state_remember_word_translate'
  | 'state_change_translate_original'
  | 'state_change_translate_translate'
  | 'state_delete_word'
  | 'state_start_input_translate';

interface SessionData {
  originalWord?: string;
  wordIdForTranslate?: number;
  startWordId?: number;
  state?: states;
  // afterCallback?: (ctx: MyContext, lng: string) => void;
  afterCallback?: () => void;
}

export type MyContext = Context & {session: SessionData};
