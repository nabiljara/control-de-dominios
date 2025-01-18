import { DB } from "@/db";
import { providers } from "@/db/schema";
import { faker } from "@faker-js/faker";
import type { InferInsertModel } from "drizzle-orm";

type ProviderInsert = InferInsertModel<typeof providers>;

const mock = async () => {
  const data: ProviderInsert[] = []
  data.push(
    { id: 3, name: 'DonWeb', url: 'https://donweb.com' },
    { id: 2, name: 'GoDaddy', url: 'https://godaddy.com' },
    { id: 1, name: 'Hostinger', url: 'https://hostinger.com.ar' }
  );
  return data;
};

export async function seed(db: DB) {
  const insertData = await mock();
  await db.insert(providers).values(insertData);
}