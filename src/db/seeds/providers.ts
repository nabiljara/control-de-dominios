import { DB } from "@/db";
import { providers } from "@/db/schema";
import type { InferInsertModel } from "drizzle-orm";

type ProviderInsert = InferInsertModel<typeof providers>;

const mock = async () => {
  const data: ProviderInsert[] = []
  data.push(
    { name: 'DonWeb', url: 'https://donweb.com' },
    { name: 'GoDaddy', url: 'https://godaddy.com' },
    { name: 'Hostinger', url: 'https://hostinger.com.ar' }
  );
  return data;
};

export async function seed(db: DB) {
  const insertData = await mock();
  await db.insert(providers).values(insertData);
}