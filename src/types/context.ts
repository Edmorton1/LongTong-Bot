import type { Context } from 'telegraf';

interface SessionData {
  originalWord?: string;
  lng?: 'en' | 'ru';
}

export type MyContext = Context & { session: SessionData };
