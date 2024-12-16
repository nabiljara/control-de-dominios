"use server"

import db from "@/db";
import { clientFormSchema, ClientFormValues } from "@/validators/client-validator";
import { ClientInsert, clients, Contact, contacts, localities } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
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

export async function getClient(id: number) {
  try {
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, id),
      with:
      {
        domains: true,
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
    console.error("Error al obtener el proveedor:", error);
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
      .where(eq(clients.id, client.id)).returning({ id: clients.id });
    success = true;
  } catch (error) {
    console.error("Error al modificar el cliente:", error);
    throw error;
  }
  if (success) {
    revalidatePath(`/clients/${client.id}`);
  }
}


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