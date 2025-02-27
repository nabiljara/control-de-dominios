"use server"

import db from "@/db";
import { clientFormSchema, ClientFormValues, clientUpdateFormSchema, ClientUpdateValues, DomainFormValues } from "@/validators/client-validator";
import { ClientInsert, clients, Contact, contacts, localities, domainHistory, AccessInsert, DomainInsert, domains } from "@/db/schema";
import { desc, eq, count, gte, and, lte, lt, asc } from "drizzle-orm";
import { revalidatePath } from 'next/cache';
import { redirect } from "next/navigation";
import { setUserId } from "./user-action/user-actions";
import { access } from "@/db/schema";
import { sql } from 'drizzle-orm'
import { encrypt } from "@/lib/utils";
import { format } from "date-fns";

export async function getClients() {
  try {
    const data = await db.query.clients.findMany({
      orderBy: [desc(clients.id)],
      with: {
        locality: true
      }
    });
    return data;
  }
  catch (error) {
    console.error("Error al obtener proveedores:", error);
    throw error;
  }
};


export async function getActiveClients() {
  try {
    const data = await db.query.clients.findMany({
      orderBy: [desc(clients.id)],
      where: eq(clients.status, 'Activo')
    });
    return data;
  }
  catch (error) {
    console.error("Error al obtener clientes activos:", error);
    throw error;
  }
};

export async function getClient(id: number) {
  try {
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, id),
      with:
      {
        domains: { with: { provider: true, accessData: true } },
        locality: true,
        access: {
          with: { provider: true, domainAccess: { with: { domain: true } } },
          orderBy: desc(access.createdAt)
        },
        contacts: {
          orderBy: desc(contacts.createdAt)
        }
      }
    });
    return client;
  }
  catch (error) {
    console.error("Error al obtener el cliente:", error);
    throw error;
  }
};

export async function getAuditClient(id: number) {
  try {
    if (!id) {
      throw new Error(`El id no está definido`);
    }
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, id),
      columns: {
        status: true,
        size: true,
        name: true,
        id: true,
      },
      with: {
        locality: { columns: { name: true } }
      }

    });
    return client;
  }
  catch (error) {
    console.error("Error al obtener el cliente:", error);
    throw error;
  }
};

export async function updateClient(client: ClientFormValues) {
  let success = false;
  try {
    const parsed = await clientFormSchema.parseAsync(client);
    if (!parsed) {
      throw new Error("Error de validación del formulario de cliente.");
    }
    if (!parsed.id) {
      throw new Error("El ID del cliente no está definido.");
    }
    await setUserId()
    await db.update(clients)
      .set({ ...parsed, updatedAt: sql`NOW()` })
      .where(eq(clients.id, parsed.id))
    success = true;
  } catch (error) {
    console.error("Error al modificar el cliente:", error);
    throw error;
  }
  if (success) {
    revalidatePath(`/clients/${client.id}`);
  }
}

export async function updateClientAndDomains(client: ClientUpdateValues) {
  try {
    const parsed = await clientUpdateFormSchema.parseAsync(client);
    await db.transaction(async (tx) => {
      
      if (!parsed.id) {
        throw new Error("El ID del cliente no está definido.");
      }

      await setUserId();
      // Actualizar cliente
      await tx
        .update(clients)
        .set({ ...parsed, updatedAt: sql`NOW()` })
        .where(eq(clients.id, parsed.id));

      // Actualizar dominios
      if (parsed.domains) {
        for (const domain of parsed.domains) {
          const data = {
            ...domain,
            expirationDate: format(domain.expirationDate, "yyyy-MM-dd HH:mm"),
          };
          
          const modifiedDomain: DomainInsert = {
            name: data.name,
            clientId: parseInt(data.client.id),
            expirationDate: data.expirationDate,
            contactId: parseInt(data.contactId),
            providerId: parseInt(data.provider.id),
            id: data.id,
            status: data.status,
          };
          
          if (!modifiedDomain.id) {
            throw new Error("El ID del cliente no está definido.");
          }
          
          await setUserId();
          await tx
            .update(domains)
            .set(modifiedDomain)
            .where(eq(domains.id, modifiedDomain.id));
        }
      }
    });
    revalidatePath(`/clients/${client.id}`);
  } catch (error) {
    console.error("Error al modificar el cliente:", error);
    throw error;
  }
}

export async function createClient(client: ClientFormValues) {
  let success = false;
  let clientId: number = 0;
  try {

    const parsed = await clientFormSchema.parseAsync(client);

    if (!parsed) {
      throw new Error("Error de validación del formulario de cliente.");
    }
    await setUserId()

    await db.transaction(async (tx) => {

      const response = await tx.insert(clients)
        .values({ localityId: parseInt(parsed.locality.id), ...parsed })
        .returning({ insertedId: clients.id });

      clientId = response[0].insertedId

      if (parsed.contacts && parsed.contacts.length > 0) {

        parsed.contacts.map((contact) => {
          contact.clientId = clientId
        })

        await tx.insert(contacts).values(parsed.contacts.map(({ id, ...rest }) => rest));
      }

      const newAccessArray: AccessInsert[] = [];

      if (parsed.access && parsed.access.length > 0) {
        parsed.access.map((access) => {
          const { encrypted, iv } = encrypt(access.password);
          const newAccess: AccessInsert = {
            clientId: clientId,
            username: access.username,
            password: `${encrypted}:${iv}`,
            notes: access.notes,
            providerId: parseInt(access.provider.id),
          }
          newAccessArray.push(newAccess)
        })
        await tx.insert(access).values(newAccessArray);
      }
    });
    success = true;
  } catch (error) {
    console.error("Error al crear el cliente: ", error);
    throw error;
  }

  if (success) {
    redirect(`/clients/${clientId}`);
  }
}
export async function getDashboardData() {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString();
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0).toISOString();

    // TODO: VER BIEN COMO TOMAR EL PORCENTAJE DE RETENCIÓN(SI ES QUE QUEDA)
    //  
    const result = await Promise.all([
      // [0]
      db.select({ count: count() }).from(clients),
      // [1]
      db.select({ count: count() }).from(clients).where(eq(clients.status, "Activo")),
      // [2]
      db.select({ count: count() }).from(clients)
        .where(gte(clients.createdAt, firstDayOfMonth)),
      // [3]
      db.select({ count: count() }).from(clients)
        .where(and(eq(clients.status, "Activo"), lt(clients.createdAt, firstDayOfMonth))),
      // [4]
      db.select({
        month: sql`DATE_TRUNC('month', CAST(${clients.createdAt} AS TIMESTAMP))`.as("month"),
        count: count(),
      })
        .from(clients)
        .groupBy(sql`DATE_TRUNC('month', CAST(${clients.createdAt} AS TIMESTAMP))`)
        .orderBy(sql`DATE_TRUNC('month', CAST(${clients.createdAt} AS TIMESTAMP)) DESC`),
    ]);
    const totalClients = result[0][0]?.count ?? 0;
    const totalActive = result[1][0]?.count ?? 0;
    const newClientsThisMonth = result[2][0]?.count ?? 0;
    const activeClientsLastMonth = result[3][0]?.count ?? 0;
    const registeredPerMonth = result[4] ?? [];

    //variación
    let variationPercentage = 0;
    if (activeClientsLastMonth > 0) {
      variationPercentage = ((totalActive - activeClientsLastMonth) / activeClientsLastMonth) * 100;
    }
    variationPercentage = Math.round(variationPercentage * 100) / 100;

    return {
      total: totalClients,
      active: totalActive,
      newClientsThisMonth,
      registeredPerMonth,
      variationPercentage,
    };
  }
  catch (error) {
    console.error("Error al obtener información de los clientes:", error);
    throw error;
  }
}


export async function getLatestClients() {
  try {
    const data = await db.select({
      id: clients.id,
      name: clients.name,
      size: clients.size,
      domainCount: sql<number>`COUNT(domain_history.id)`.as("domainCount"),
      createdAt: clients.createdAt
    }).from(clients).
      leftJoin(domainHistory, and(eq(domainHistory.entity, "Clientes"),
        eq(domainHistory.entityId, clients.id),
        eq(domainHistory.active, true))).
      groupBy(clients.id).orderBy(asc(clients.createdAt));
    return data;
  }
  catch (error) {
    console.error("Error al obtener proveedores:", error);
    throw error;
  }
};