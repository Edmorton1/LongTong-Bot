import type {Words} from '@domain';
import type {Context} from 'telegraf';
import type {UnwrapColumns} from './utils';

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
  startWord?: UnwrapColumns<Pick<Words, 'wordId' | 'original' | 'translate'>>;
  state?: states;
}

export type MyContext = Context & {session: SessionData};
