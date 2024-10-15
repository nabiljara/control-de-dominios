import { DB } from "@/db";
import { access } from "@/db/schema";
import { faker } from "@faker-js/faker";
import { InferInsertModel } from "drizzle-orm";

type AccessInsert = InferInsertModel<typeof access>;

const mock = async (db: DB) => {
  const clientsData = await db.query.clients.findMany();
  const domainsData = await db.query.domains.findMany();

  const data: AccessInsert[] = [];

  // Generar registros de acceso
  domainsData.forEach(domain => {
    // Encontrar el cliente correspondiente para el dominio
    const client = clientsData.find(client => client.id === domain.clientId);
    if (client) {
      data.push({
        clientId: client.id,
        providerId: domain.providerId,
        username: faker.internet.userName(),
        password: faker.internet.password(),
        notes: faker.lorem.sentence(), // Notas opcionales
      });
    }
  });

  return data;
};

export async function seed(db: DB) {
  const insertData = await mock(db);
  await db.insert(access).values(insertData);
}