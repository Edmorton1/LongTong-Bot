import {type Kysely, sql} from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('name', 'varchar(64)', (col) => col.notNull())
    .execute();
  await db.schema
    .createTable('words')
    .addColumn('id', sql`INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY`)
    .addColumn('original', 'varchar(128)', (col) => col.notNull())
    .addColumn('translate', 'varchar(128)', (col) => col.notNull())
    .execute();
  await db.schema
    .createTable('relations')
    .addColumn('wordId', 'integer', (col) => col.notNull())
    .addForeignKeyConstraint('fk_word', ['wordId'], 'words', ['id'])
    .addColumn('userId', 'integer', (col) => col.notNull())
    .addForeignKeyConstraint('fk_user', ['userId'], 'users', ['id'])
    .addColumn('correct', 'smallint', (col) => col.notNull().defaultTo(0))
    .addColumn('incorrect', 'smallint', (col) => col.notNull().defaultTo(0))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('relations').ifExists().execute();
  await db.schema.dropTable('words').ifExists().execute();
  await db.schema.dropTable('users').ifExists().execute();
}
