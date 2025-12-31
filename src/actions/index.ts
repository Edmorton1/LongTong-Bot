import {readdirSync} from 'node:fs';
import {join} from 'node:path';
import {Action} from './Action';

export const actions: Action[] = [];

const files = readdirSync(__dirname).filter(
  (file) => file !== 'index.ts' && file !== 'Action.ts' && file.endsWith('.ts')
);

for (const file of files) {
  const mod = require(join(__dirname, file));

  const ActionClass = mod.default;

  if (typeof ActionClass === 'function') {
    const instance = new ActionClass();
    if (instance instanceof Action) {
      actions.push(instance);
    }
  }
}
