import {logger, pg} from '@connections';
import {type MyContext, STATES} from '@interfaces/context';
import {EndHandler} from '@telefy/EndHandler';
import {getTxt, getUserId} from '@utils';
import {t} from '../../locales/i18n';

const formatError = (line: string, index: number) =>
  `❌ Dictionary format error!\n\nLine ${index + 1} is invalid:\n` +
  '```\n' +
  line +
  '\n```\n';

class End extends EndHandler {
  react = STATES.loadDictionary;

  async action(ctx: MyContext, lng: string) {
    ctx.session.state.type = undefined;
    const LINE_REGEX = /^.+ [-–—] .+$/;

    let text: string | undefined;

    if (ctx.message.document) {
      try {
        text = await getTxt(ctx);
      } catch (err) {
        if (err instanceof Error) {
          ctx.reply(err.message);
          return;
        }
      }
    } else {
      text = ctx.message.text;
    }

    if (!text) {
      throw new Error('text is undefined');
    }

    const userId = getUserId(ctx);

    try {
      const words = text
        .split('\n')
        .reduce<[string, string][]>((acc, line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return acc;

          if (!LINE_REGEX.test(trimmed)) {
            throw new Error(
              formatError(trimmed, i) +
                'Fix the format:\nword - translation (spaces around the dash are required)'
            );
          }

          const parts = trimmed.split(' - ');
          if (!parts[0] || !parts[1]) {
            throw new Error(formatError(trimmed, i));
          }

          acc.push([parts[0].trim(), parts[1].trim()] as [string, string]);
          return acc;
        }, []);

      ctx.reply(t('responses.load_dictionary.successful', lng));
    } catch (err) {
      logger().error(err);
      if (err instanceof Error) {
        ctx.reply(err.message, {parse_mode: 'Markdown'});
        return;
      }
    }
  }
}

function uploadWords(words: [string, string][], userId: number) {
  return pg()
    .insertInto('words')
    .values(
      words.map(([original, translate]) => ({
        original,
        translate,
        userId
      }))
    )
    .onConflict((oc) =>
      oc.column('original').doUpdateSet({
        translate: (qb) => qb.ref('excluded.translate')
      })
    );
}

export default End;
