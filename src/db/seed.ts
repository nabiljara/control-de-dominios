import { sql, Table } from "drizzle-orm";
import dotenv from 'dotenv';
import * as schema from "@/db/schema";
import * as seeds from "@/db/seeds";
import { drizzle } from 'drizzle-orm/postgres-js';

import postgres from 'postgres';

dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL ?? "";
const sql_ = postgres(
  DATABASE_URL
);
const db = drizzle(sql_, { schema });
type DB = typeof db;

async function resetTable(db: DB, table: Table) {
  return db.execute(sql`truncate table ${table} restart identity cascade`);
}

async function main() {
  for (const table of [
    schema.providers,
    schema.localities,
    schema.clients,
    schema.contacts,
    schema.users,
    schema.domains,
  ]) {
    await resetTable(db, table);
  }
  await seeds.providers(db);
  await seeds.localities(db);
  await seeds.clients(db);
  await seeds.contacts(db);
  await seeds.users(db);
  await seeds.domains(db);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding hecho!");
    process.exit(0);
  });
