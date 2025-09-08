import { DB } from "@/db";
import { domains } from "@/db/schema";

const mockDomains = async () => {
  return [
    {
      clientId: 1,
      providerId: 1,
      contactId: 1,
      name: "https://vencehoy.com",
      expirationDate: "2025-09-10T00:00:00Z",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      clientId: 1,
      providerId: 1,
      contactId: 1,
      name: "https://vence7dias.com",
      expirationDate: "2025-09-17T00:00:00Z",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      clientId: 1,
      providerId: 1,
      contactId: 1,
      name: "https://vence30dias.com",
      expirationDate: "2025-09-09T00:00:00Z",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      clientId: 1,
      providerId: 1,
      contactId: 1,
      name: "https://vencido.com",
      expirationDate: "2021-05-19T00:00:00Z",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};


export async function seed(db: DB) {
  const domainsData = await mockDomains();
  await db.insert(domains).values(domainsData)
}
