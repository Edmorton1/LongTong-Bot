import type {TextCommands} from './utils';

export const COMMANDS = {
  START: 'start',
  TRANSLATE_WORD: 'translate_words',
  REMEMBER_WORD: 'remember_word',
  LOAD_DICTIONARY: 'load_dictionary',
  SHOW_DICTIONARY: 'show_dictionary',
  ABORT: 'abort'
} as const;

type CommandDescriptions = {
  [K in keyof typeof COMMANDS]: TextCommands;
};

export const COMMAND_DESCRIPTIONS: CommandDescriptions = {
  START: 'start',
  TRANSLATE_WORD: 'keyboard.translate_word',
  REMEMBER_WORD: 'keyboard.remember_word',
  LOAD_DICTIONARY: 'keyboard.load_dictionary',
  SHOW_DICTIONARY: 'keyboard.show_dictionary',
  ABORT: 'abort.description'
} as const;
