import { DB } from "@/db";
import { ClientInsert, clients } from "@/db/schema";

const mock = async () => {
  const data: ClientInsert[] = []
  data.push(
    { name: 'Kernel SAS', size:'Chico', status:'Activo', localityId:1 },
  );
  return data;
};

export async function seed(db: DB) {
  const insertData = await mock();
  await db.insert(clients).values(insertData);
}