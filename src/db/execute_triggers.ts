import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import * as schema from '@/db/schema';
import { createTriggers } from './procedures/triggers';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL ?? "";
const sql_ = neon(DATABASE_URL);
const db = drizzle(sql_, { schema });

async function main() {
  await createTriggers(db);
  console.log("Triggers creados correctamente.");
}

main()
  .catch((e) => {
    console.error("Error creando Triggers:", e);
    process.exit(1);
  })
  .finally(() => {
    console.log("Triggers ok.");
    process.exit(0);
  });
