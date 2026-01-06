import {type Kysely, sql} from 'kysely';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db.executeQuery(
    sql`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW."updatedAt" = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `.compile(db)
  );

  // Создаём триггер на таблицу words
  await db.executeQuery(
    sql`
    CREATE TRIGGER update_updated_at
    BEFORE UPDATE ON words
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.compile(db)
  );
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db.executeQuery(
    sql`DROP TRIGGER IF EXISTS update_updated_at ON words;`.compile(db)
  );

  await db.executeQuery(
    sql`DROP FUNCTION IF EXISTS update_updated_at_column();`.compile(db)
  );
}
