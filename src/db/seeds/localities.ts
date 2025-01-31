import { DB } from "@/db";
import { localities } from "@/db/schema";
import type { InferInsertModel } from "drizzle-orm";

type LocalityInsert = InferInsertModel<typeof localities>;

const mock = async () => {
  const data: LocalityInsert[] = []
  data.push(
    { name: 'Comodoro Rivadavia' },
    { name: 'Neuquén' },
    { name: 'Puerto Madryn' },
    { name: 'Buenos Aires' },
  );
  return data;
};

export async function seed(db: DB) {
  const insertData = await mock();
  await db.insert(localities).values(insertData);
}