import { drizzle } from 'drizzle-orm/postgres-js';

import postgres from 'postgres';

import * as schema from './schema'

const DATABASE_URL = process.env.DATABASE_URL ?? "";

let sqlInstance: ReturnType<typeof postgres> | null = null;

function getSqlInstance() {
  if (!sqlInstance) {
    sqlInstance = postgres(DATABASE_URL, {
      max: 5,
      idle_timeout: 10
    });
  }
  return sqlInstance;
}

export const sql = getSqlInstance();

// export const sql = postgres(
//   DATABASE_URL,
//   {
//     max: 5,
//     idle_timeout: 10
//   }
// );

const db = drizzle(sql, { schema });

export type DB = typeof db;

export default db;