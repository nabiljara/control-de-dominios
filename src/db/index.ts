// import { drizzle } from 'drizzle-orm/postgres-js';

// import postgres from 'postgres';


// import * as schema from './schema'

// const DATABASE_URL = process.env.DATABASE_URL ?? "";
// export const sql = postgres(
//   DATABASE_URL
// );

// const db = drizzle(sql, { schema });

// export type DB = typeof db;

// export default db;

// import { drizzle } from 'drizzle-orm/node-postgres';
// import { Pool } from 'pg';

// import * as schema from './schema';

// const DATABASE_URL = process.env.DATABASE_URL ?? "";

// const pool = new Pool({
//   connectionString: DATABASE_URL,
// });

// const db = drizzle(pool, { schema });

// export type DB = typeof db;

// export default db;

// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import * as schema from "./schema";

// const DATABASE_URL = process.env.DATABASE_URL ?? "";

// // Evita que se reinicialice la conexión en cada recarga en desarrollo
// const globalForDb = globalThis as unknown as { sql: ReturnType<typeof postgres> | undefined };

// if (!globalForDb.sql) {
//   console.log("📡 Creando conexión única a PostgreSQL...");
//   globalForDb.sql = postgres(DATABASE_URL);
// }

// export const sql = globalForDb.sql;
// const db = drizzle(sql, { schema });

// export type DB = typeof db;
// export default db;

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

const sql = getSqlInstance();

// export const sql = postgres(
//   DATABASE_URL,
//   {
//     max: 5,
//     idle_timeout: 10
//   }
// );

const db = drizzle(sql, { schema });

export type DB = typeof db;

export default db;