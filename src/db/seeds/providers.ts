import { DB } from "@/db";
import { providers } from "@/db/schema";
import { faker } from "@faker-js/faker";
import type { InferInsertModel } from "drizzle-orm";

type ProviderInsert = InferInsertModel<typeof providers>;

const mock = async () => {
  const data : ProviderInsert [] = []
    for (let i = 0; i < 10; i++) {
      data.push({
        name: faker.person.lastName(),
        url: faker.internet.url()
      });
    }
    return data;
};

export async function seed(db: DB) {
  const insertData = await mock();
  await db.insert(providers).values(insertData);
}