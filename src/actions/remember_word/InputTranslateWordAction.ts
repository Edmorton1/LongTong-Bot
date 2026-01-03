import {pg} from '@connections';
import type {Users, Words} from '@domain';
import type {MyContext} from '@interfaces/context';
import {t} from '../../locales/i18n';
import {Action} from '../Action';

class InputTranslateWordAction extends Action {
  constructor() {
    super('responses.start.input_translate');
  }

  async action(ctx: MyContext, lng: string) {
    // TODO: Улучшить тип
    const {id: userId} = ctx.from!;

    const original = ctx.session.originalWord;

    if (!original) {
      ctx.reply(t('responses.start.input_original', lng));
      return;
    }

    const translate = ctx.message.text;

    await this.saveWordAndCreateRelation({userId, original, translate});

    ctx.reply(
      t('responses.start.word_saved', lng, {
        original,
        translate
      })
    );
  }

  private saveWordAndCreateRelation(
    word: {userId: Users['id']} & Omit<Words, 'id'>
  ) {
    const {userId, ...wordDto} = word;

    return pg()
      .transaction()
      .execute(async (trx) => {
        const {id: wordId} = await trx
          .insertInto('words')
          .values(wordDto)
          .returning('id')
          .executeTakeFirstOrThrow();

        await trx.insertInto('relations').values({userId, wordId}).execute();
      });
  }
}

export default InputTranslateWordAction;
