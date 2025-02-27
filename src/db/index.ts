import { drizzle } from 'drizzle-orm/postgres-js';

import postgres from 'postgres';


import * as schema from './schema'

const DATABASE_URL = process.env.DATABASE_URL ?? "";
export const sql = postgres(
  DATABASE_URL
);

const db = drizzle(sql, { schema });

export type DB = typeof db;

export default db;