import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import * as schema from '@/db/schema';
import { createFunctions } from './procedures/functions';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL ?? "";
const sql_ = neon(DATABASE_URL);
const db = drizzle(sql_, { schema });

async function main() {
  await createFunctions(db);
  console.log("Funciones creadas correctamente.");
}

main()
  .catch((e) => {
    console.error("Error creando funciones: ", e);
    process.exit(1);
  })
  .finally(() => {
    console.log("Funciones ok.");
    process.exit(0);
  });
