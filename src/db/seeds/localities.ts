import { DB } from "@/db";
import { localities } from "@/db/schema";
import type { InferInsertModel } from "drizzle-orm";

type LocalityInsert = InferInsertModel<typeof localities>;

const mock = async () => {
  const data: LocalityInsert[] = []
  data.push(
    { id: 4, name: 'Neuquén' },
    { id: 3, name: 'Puerto Madryn' },
    { id: 2, name: 'Buenos Aires' },
    { id: 1, name: 'Comodoro Rivadavia' }
  );
  return data;
};

export async function seed(db: DB) {
  const insertData = await mock();
  await db.insert(localities).values(insertData);
}