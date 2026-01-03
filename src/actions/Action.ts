import type { MyContext } from '@interfaces/context';
import type { Commands } from '@interfaces/utils';

export abstract class Action {
  constructor(public command: Commands) {}

  protected abstract action(ctx: MyContext, lng: string): void;

  public run(ctx: MyContext) {
    const lng = ctx.session.lng ?? ctx.from?.language_code ?? 'en';
    this.action(ctx, lng);
  }

  public getCallbacks() {
    const prototypes = Object.getPrototypeOf(this);

    return Object.getOwnPropertyNames(prototypes).reduce<
      // TODO: Type duplicate
      { name: string; handler: (ctx: MyContext) => void }[]
    >((acc, methodName) => {
      if (
        methodName.startsWith('callback') &&
        typeof (this as any)[methodName] === 'function'
      ) {
        const handler = (this as any)[methodName].bind(this);

        const name = methodName.split('callback')[1];

        if (!name) {
          throw new Error('Callback name is not valid');
        }

        acc.push({
          name: name.charAt(0).toLowerCase() + name.slice(1),
          handler,
        });
      }

      return acc;
    }, []);
  }
}
