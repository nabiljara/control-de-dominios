import 'server-only'
import db from '@/db';
import { lower, users } from "@/db/schema";
import { eq } from 'drizzle-orm';

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

