import {logger, pg} from '@connections';
import {type MyContext, STATES} from '@interfaces/context';
import {EndHandler} from '@telefy/handlers/EndHandler';
import {getTxt, getUserId} from '@telefy/utils';
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
        if (err instanceof Error && err.message.startsWith('File')) {
          ctx.reply(err.message);
          return;
        }
        logger().error(err);
      }
    } else {
      text = ctx.message.text;
    }

    if (!text) {
      throw new Error('text is undefined');
    }

    const userId = getUserId(ctx);

    try {
      const wordsMap = text
        .split('\n')
        .reduce<Map<string, string>>((acc, line, i) => {
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

          // Если слово уже есть, перезаписываем перевод новым
          acc.set(parts[0].trim(), parts[1].trim());

          return acc;
        }, new Map<string, string>());

      await uploadWords(Array.from(wordsMap.entries()), userId);

      ctx.reply(t('responses.load_dictionary.successful', lng));
    } catch (err) {
      if (err instanceof Error && err.message.startsWith('❌')) {
        ctx.reply(err.message, {parse_mode: 'Markdown'});
        return;
      }
      logger().error(err);
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
      oc.columns(['userId', 'original']).doUpdateSet({
        translate: (qb) => qb.ref('excluded.translate')
      })
    )
    .execute();
}

export default End;
