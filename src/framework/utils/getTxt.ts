import type {MyContext} from '@interfaces/context';
import {getLng} from '@telefy/utils';
import {t} from '../../locales/i18n';

const getTxt = async (ctx: MyContext): Promise<string> => {
  const document = ctx.message.document;

  const link = (await ctx.telegram.getFileLink(document.file_id)).href;

  const lng = getLng(ctx);

  if (
    !document.file_name?.endsWith('.txt') ||
    document.mime_type !== 'text/plain'
  ) {
    throw new Error(t('responses.load_dictionary.not_correct_file', lng));
  }

  if (!document.file_size || document.file_size > 500 * 1024) {
    throw new Error(t('responses.load_dictionary.big_size', lng));
  }

  const res = await fetch(link);
  const buffer = Buffer.from(await res.arrayBuffer());
  return buffer.toString('utf-8');
};

export default getTxt;
