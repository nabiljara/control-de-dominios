import { DB } from "@/db";
import { domains } from "@/db/schema";
import { faker } from "@faker-js/faker";
import { InferInsertModel } from "drizzle-orm";

type DomainInsert = InferInsertModel<typeof domains>;

const mock = async (db: DB) => {
  const clientsData = await db.query.clients.findMany();
  const contactsData = await db.query.contacts.findMany();
  const providersData = await db.query.providers.findMany();

  const data: DomainInsert[] = [];

  clientsData.forEach(client => {
    // Obtener los contactos asociados al cliente actual
    const clientContacts = contactsData.filter(contact => contact.clientId === client.id);

    // Asegurarse de que haya al menos un contacto disponible
    if (clientContacts.length === 0) return;

    // Determinar si el cliente tendrá 1 o 2 dominios
    const numberOfDomains = faker.helpers.arrayElement([1, 2]);

    for (let i = 0; i < numberOfDomains; i++) {
      data.push({
        clientId: client.id,
        // Asignar un proveedor al azar de la lista de proveedores
        providerId: faker.helpers.arrayElement(providersData).id,
        // Asignar un contacto al azar del cliente actual
        contactId: faker.helpers.arrayElement(clientContacts).id,
        name: faker.internet.domainName(),
        status: faker.helpers.arrayElement(["active", "inactive", "suspended"]),
        createdAt: faker.date.past().toDateString(),
        expirationDate: faker.date.future().toDateString(),
      });
    }
  });
  // Generar 6 dominios adicionales con contactos sin clientId
  const domainContacts = contactsData.filter(contact => contact.clientId === null);
  for (let i = 0; i < 6; i++) {
    if (domainContacts.length > 0) {
      data.push({
        clientId: faker.helpers.arrayElement(clientsData).id, // Sin cliente asignado
        providerId: faker.helpers.arrayElement(providersData).id,
        contactId: faker.helpers.arrayElement(domainContacts).id,
        name: faker.internet.domainName(),
        status: faker.helpers.arrayElement(["active", "inactive", "suspended"]),
        createdAt: faker.date.past().toDateString(),
        expirationDate: faker.date.future().toDateString(),
      });
    }
  }

  return data;
};

export async function seed(db: DB) {
  const insertData = await mock(db);
  await db.insert(domains).values(insertData);
}
