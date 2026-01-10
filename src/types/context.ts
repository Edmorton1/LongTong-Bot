import type {Context, NarrowedContext} from 'telegraf';
import type {Message, Update} from 'telegraf/types';

export const STATES = {
  rememberWordOriginal: 'state_remember_word_original',
  rememberWordTranslate: 'state_remember_word_translate',
  changeTranslateOriginal: 'state_change_translate_original',
  changeTranslateTranslate: 'state_change_translate_translate',
  deleteWord: 'state_delete_word',
  startInputTranslate: 'state_start_input_translate',
  loadDictionary: 'state_load_dictionary'
} as const;

export type States = (typeof STATES)[keyof typeof STATES];

interface SessionData {
  state: {
    type?: States;
    data?: any;
  };
  afterCallback?: () => void;
  action?: any;
  last_message_id?: number;
}

export type MyContext = Context & {session: SessionData};

export type CreateContext<T extends Message> = NarrowedContext<
  MyContext,
  Update.MessageUpdate<T>
>;

export type TextContext = CreateContext<Message.TextMessage>;

export type FileContext = CreateContext<Message.DocumentMessage>;
