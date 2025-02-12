import { DB } from "@/db";
import { contacts } from "@/db/schema";
import { faker } from "@faker-js/faker";
import type { InferInsertModel } from "drizzle-orm";

type ContactInsert = InferInsertModel<typeof contacts>;
const mock = async (db: DB) => {

  // const clientsData = await db.query.clients.findMany();
  
  // const data : ContactInsert [] = clientsData.map(client => ({
  //   clientId: client.id,
  //   type: faker.helpers.arrayElement(["technical", "administrative", "financial"]),
  //   name: faker.person.fullName(),
  //   email: faker.internet.email(),
  //   phone: faker.phone.number(),
  //   updatedAt: faker.date.past().toDateString(),
  // }));

  // for (let i = 0; i < 6; i++) {
  //   data.push({
  //     clientId: null,
  //     type: faker.helpers.arrayElement(["Tecnico", "Administrativo", "Financiero"]),
  //     name: faker.person.fullName(),
  //     email: faker.internet.email(),
  //     phone: faker.phone.number(),
  //   });
  // }

  // return data;
};

export async function seed(db: DB) {
  const insertData = await mock(db);
  // await db.insert(contacts).values(insertData);
}