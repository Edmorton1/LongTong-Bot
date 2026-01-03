import { readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { Action } from './Action';
import type { MyContext } from '@interfaces/context';

export const actions: Action[] = [];
// TODO: Type duplicate
export const callbacks: { name: string; handler: (ctx: MyContext) => void }[] =
  [];

async function loadFilesRecursively(dir: string) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      await loadFilesRecursively(fullPath);
    } else if (
      stat.isFile() &&
      extname(entry) === '.ts' &&
      entry !== 'index.ts' &&
      entry !== 'Action.ts'
    ) {
      const module = await import(fullPath);
      const ActionClass = module.default;

      if (typeof ActionClass === 'function') {
        const instance = new ActionClass();
        if (instance instanceof Action) {
          const actionCallbacks = instance.getCallbacks();
          if (actionCallbacks?.length) {
            callbacks.push(...actionCallbacks);
          }
          actions.push(instance);
        }
      }
    }
  }
}

await loadFilesRecursively(__dirname);
