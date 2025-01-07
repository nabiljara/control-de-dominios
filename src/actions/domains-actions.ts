"use server"
import db from "@/db";
import { clients, contacts, domainAccess, DomainHistory, DomainInsert, domains, DomainWithRelations, providers } from "@/db/schema";
import { asc, desc, eq, or, sql } from "drizzle-orm";
import { ContactPerDomain } from "../../types/contact-types";
import { setUserId } from "./user-action/user-actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { decryptPassword } from "@/lib/utils";


export async function getDomains() {
  try {
    const data = await db.query.domains.findMany({
      orderBy: [asc(domains.expirationDate)],
      with: {
        provider: {
          columns: {
            id: true,
            name: true,
          }
        },
        client: {
          columns: {
            id: true,
            name: true,
          }
        }
      }
    });
    return data;
  }
  catch (error) {
    console.error("Error al obtener los dominios:", error);
    throw error;
  }
};

export async function getDomain(id: number): Promise<DomainWithRelations | undefined> {
  try {
    const domain = await db.query.domains.findFirst({
      where: eq(domains.id, id),
      with:
      {
        client: true,
        contact: true,
        provider: true,
        history: {
          orderBy: (history, { desc }) => [desc(history.startDate)],
        },
        accessData: {
          with: {
            access: {
              with: {
                provider: true
              }
            }
          }
        }
      }
    });
    if (domain?.accessData) {
      const decryptedPassword = decryptPassword(domain.accessData.access.password)
      domain.accessData.access.password = decryptedPassword ? decryptedPassword : '';
    }
    return domain;
  }
  catch (error) {
    console.error("Error al obtener el dominio:", error);
    throw error;
  }
};


export async function getDomainsByContact(idContact: number) {
  try {
    const data = await db.query.domains.findMany({
      where: eq(domains.contactId, idContact),
      orderBy: [desc(domains.id)],
      with: {
        provider: true,
        client: true,
      }
    });
    return data;
  }
  catch (error) {
    console.error("Error al obtener los dominios:", error);
    throw error;
  }
};


export async function updateDomainContact(contactDomain: ContactPerDomain[]) {
  try {
    contactDomain.map(async (contact) => {
      await db.update(domains)
        .set({ contactId: contact.contactId })
        .where(eq(domains.id, contact.domainId)).returning({ id: domains.id });
    })
  }
  catch (error) {
    console.error("Error al obtener los dominios:", error);
    throw error;
  }
};

export async function updateDomain(domain: DomainInsert, accessId: number | undefined ) {
  let success = false;
  try {
    await setUserId()
    await db.transaction(async (tx) => {

      if (!domain.id) {
        throw new Error("El ID del dominio no está definido.");
      }

      await tx.update(domains)
        .set({ name: domain.name, expirationDate: domain.expirationDate, status: domain.status, updatedAt: sql`NOW()`, clientId: domain.clientId, providerId: domain.providerId, contactId: domain.contactId })
        .where(eq(domains.id, domain.id))

      //Busco si el dominio tiene un acceso asociado
      const response = await db.query.domainAccess.findFirst({ where: eq(domainAccess.domainId, domain.id) })

      //Si tiene acceso asociado y no se seleccionó un acceso, elimino la asociación
      if (response && !accessId) {
        await tx.delete(domainAccess)
          .where(eq(domainAccess.domainId, domain.id));
      }
      //Si no tiene acceso asociado y se seleccionó un acceso, creo la asociación
      else if (accessId) {
        if (!response) {
          await tx.insert(domainAccess)
            .values({
              domainId: domain.id,
              accessId
            });
        }
        //Si tiene acceso asociado y se seleccionó un acceso, actualizo la asociación
        else {
          await tx.update(domainAccess)
            .set({
              domainId: domain.id,
              accessId
            })
            .where(eq(domainAccess.domainId, domain.id));
        }
      }
    });
    success = true;
  }
  catch (error) {
    console.error("Error al modificar el dominio:", error);
    throw error;
  }
  if (success) {
    revalidatePath(`/domains/${domain.id}`);
  }
};

export async function insertDomain(domain: DomainInsert, accessId: number | undefined) {
  let success = false;
  try {
    await setUserId()
    await db.transaction(async (tx) => {
      const response = await tx.insert(domains)
        .values({
          name: domain.name,
          expirationDate: domain.expirationDate,
          status: domain.status,
          clientId: domain.clientId,
          providerId: domain.providerId,
          contactId: domain.contactId,
        })
        .returning({ insertedId: domains.id });
      if (accessId) {
        await tx.insert(domainAccess)
          .values({
            domainId: response[0].insertedId,
            accessId
          });
      }
    });
    success = true
  }
  catch (error) {
    console.error("Error al crear el dominio:", error);
    throw error;
  }
  if (success) {
    revalidatePath('/domains');
    redirect('/domains');
  }
};

export async function validateDomainName(name: string) {
  try {
    const response = await db.query.domains.findFirst({
      where: eq(domains.name, name)
    });
    return response ? false : true;
  } catch (error) {
    console.error("Error al validar el email")
  }
}

export async function getHistory(history: DomainHistory[]) {
  try {
    const providersHistory = [];
    const contactsHistory = [];
    const clientsHistory = [];

    for (const item of history) {
      let data;
      switch (item.entity) {
        case 'Proveedores':
          data = await db.query.providers.findFirst({
            where: eq(providers.id, item.entityId),
          });
          if (data) providersHistory.push({ ...item, data });
          break;
        case 'Contactos':
          data = await db.query.contacts.findFirst({
            where: eq(contacts.id, item.entityId),
          });
          if (data) contactsHistory.push({ ...item, data });
          break;
        case 'Clientes':
          data = await db.query.clients.findFirst({
            where: eq(clients.id, item.entityId),
            with: {
              locality: true
            }
          });
          if (data) clientsHistory.push({ ...item, data });
          break;
        default:
          break;
      }
    }
    return {
      providersHistory,
      contactsHistory,
      clientsHistory
    };
  } catch (error) {
    console.error("Error al obtener el historial del dominio:", error);
    throw error;
  }
}



