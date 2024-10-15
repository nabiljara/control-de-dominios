import { defineConfig } from 'drizzle-kit'

import type { Config } from 'drizzle-kit'

const DATABASE_URL = process.env.DATABASE_URL ?? "" ;

const drizzleConfig = {
schema : "./src/db/schema.ts",
out: "./src/db/migrations",
dialect: "postgresql",
dbCredentials :{ url: DATABASE_URL },
} satisfies Config;

export default defineConfig(drizzleConfig);