import type { Context } from 'telegraf';

interface SessionData {
  originalWord?: string;
}

export type MyContext = Context & { session: SessionData };
