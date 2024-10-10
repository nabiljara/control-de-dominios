import 'server-only'
import db from '@/drizzle';
import { eq } from 'drizzle-orm/expressions';
import { lower, users } from "@/drizzle/schema";

export const findUserByEmail = async (
  email: string
): Promise<typeof users.$inferSelect | null> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()))
    .then((res) => {
      return res[0] ?? null
    })
  return user;
}

