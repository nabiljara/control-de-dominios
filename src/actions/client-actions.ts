"use server"

import db from "@/db";
import { clientFormSchema, ClientFormValues } from "@/validators/client-validator";
import { ClientInsert, clients, Contact, contacts, localities, domainHistory } from "@/db/schema";
import { desc, eq, count, gte, and, lte, lt, asc} from "drizzle-orm";
import { revalidatePath } from 'next/cache';
import { redirect } from "next/navigation";
import { setUserId } from "./user-action/user-actions";
import { access } from "@/db/schema";
import { encrypt } from "@/lib/utils";
import { sql } from 'drizzle-orm'

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
    console.error("Error al obtener proveedores:", error);
    throw error;
  }
};

export async function getClient(id: number) {
  try {
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, id),
      with:
      {
        domains: { with: { provider: true } },
        locality: true,
        access: {
          with: { provider: true }
        },
        contacts: true
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

export async function updateClient(client: ClientInsert) {
  let success = false;
  try {
    if (!client.id) {
      throw new Error("El ID del cliente no está definido.");
    }
    await setUserId()
    await db.update(clients)
      .set({ name: client.name, localityId: client.localityId, size: client.size, status: client.status, updatedAt: sql`NOW()` })
      .where(eq(clients.id, client.id))
    success = true;
  } catch (error) {
    console.error("Error al modificar el cliente:", error);
    throw error;
  }
  if (success) {
    revalidatePath(`/clients/${client.id}`);
  }
}

// TODO: NO USAR TIPO DE ZOD USAR EL DE LA BASE DE DATOS 
//! ARREGLAR
export async function insertClient(client: ClientFormValues) {
  let success = false;
  try {
    const parsed = clientFormSchema.safeParse(client);
    if (!parsed.success) {
      throw new Error("Error de validación del formulario");
    }
    await setUserId()

    await db.transaction(async (tx) => {
      const response = await tx.insert(clients)
        .values({
          name: client.name,
          localityId: parseInt(client.locality.id, 10),
          size: client.size,
          status: client.status,
        })
        .returning({ insertedId: clients.id });
      console.log("Cliente insertado con id:", response[0].insertedId);
      if (client.contacts && client.contacts.length > 0) {
        client.contacts.map((contact) => {
          contact.clientId = response[0].insertedId
        })
        await tx.insert(contacts).values(client.contacts);
        console.log("Contactos agregados correctamente.");
      }

      if (client.accesses && client.accesses.length > 0) {
        client.accesses.map((access) => {
          access.clientId = response[0].insertedId
          const { encrypted, iv } = encrypt(access.password);
          access.password = `${encrypted}:${iv}`
          access.providerId = parseInt(access.provider.id, 10)
        })
        await tx.insert(access).values(client.accesses);
        console.log("Contactos agregados correctamente.");
      }
    });
    success = true;
  } catch (error) {
    console.error("Error al insertar cliente o contactos:", error);
    throw error;
  }

  if (success) {
    revalidatePath('/clients');
    redirect('/clients');
  }
}
export async function getDashboardData(){
  try{
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
        .where( gte(clients.createdAt, firstDayOfMonth)),
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