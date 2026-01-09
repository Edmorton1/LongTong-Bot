import {readdirSync, statSync} from 'node:fs';
import {extname, join} from 'node:path';
import {allHandlers} from './allHandlers';
import {EndHandler} from './EndHandler';
import {IntermediateHandler} from './IntermediateHandler';
import {StartHandler} from './StartHandler';

export const loadDirectories = async (
  path: string
) => {
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
        entry !== 'index.ts'
      ) {
        const module = await import(fullPath);
        const HandleClass = module.default;

        if (typeof HandleClass === 'function') {
          const instance = new HandleClass();
          if (instance instanceof StartHandler) {
            allHandlers.start.push(instance);
          } else if (instance instanceof IntermediateHandler) {
            allHandlers.intermediate.push(instance);
          } else if (instance instanceof EndHandler) {
            allHandlers.end.push(instance);
          }
        }
      }
    }
  }

  await loadFilesRecursively(path);
};
