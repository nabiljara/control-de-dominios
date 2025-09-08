import { DB } from "@/db";
import { ClientInsert, clients } from "@/db/schema";

const mock = async () => {
  const data: ClientInsert[] = []
  data.push(
    { name: 'Nabil', size: 'Chico', status: 'Activo', localityId: 1 },
    { name: 'Lucía', size: 'Mediano', status: 'Activo', localityId: 2 },
    { name: 'Carlos', size: 'Grande', status: 'Inactivo', localityId: 3 },
    { name: 'María', size: 'Chico', status: 'Activo', localityId: 2 },
    { name: 'Jorge', size: 'Mediano', status: 'Activo', localityId: 1 },
    { name: 'Ana', size: 'Grande', status: 'Inactivo', localityId: 3 }
  );
  return data;
};

export async function seed(db: DB) {
  const insertData = await mock();
  await db.insert(clients).values(insertData);
}