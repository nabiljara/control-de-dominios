import { DB } from "@/db";
import { ContactInsert, contacts } from "@/db/schema";

const mock = async () => {
  const data: ContactInsert[] = []
  data.push(
    { name: 'Nabil Jara', email:'nabil@gmail.com', status:'Activo', type:'Soporte', clientId:1},
  );
  return data;
};

export async function seed(db: DB) {
  const insertData = await mock();
  await db.insert(contacts).values(insertData);
}