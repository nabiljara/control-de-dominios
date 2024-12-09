"use server"

import db, { sql } from "@/db";
import { auth } from "../auth"
import { clientFormSchema, ClientFormValues } from "@/validators/client-validator";
import { clients, Contact, contacts } from "@/db/schema";
import { desc, SQL } from "drizzle-orm";
import { revalidatePath } from 'next/cache';
import { redirect } from "next/navigation";
import { setUserId } from "./user-action/user-actions";

export async function getClients() {
  try {
    const data = await db.query.clients.findMany({
      orderBy: [desc(clients.id)],
    });
    return data;
  }
  catch (error) {
    console.error("Error al obtener proveedores:", error);
    throw error;
  }
};

// export async function insertClient(client: ClientFormValues) {
//   const parsed = clientFormSchema.safeParse(client);
//   let success = false;
//   try {
//     if (!parsed.success) {
//       throw new Error("Error de validación del formulario");
//     }
//     await setUserId()

//     const response = await db.insert(clients)
//       .values({
//         name: client.name,
//         localityId: parseInt(client.locality.id, 10),
//         size: client.size,
//         status: client.state,
//       }).returning({ insertedId: clients.id });

//     console.log("Cliente insertado con id:", response[0].insertedId);

//     if (client.contacts && client.contacts.length > 0) {
//       const contactQueries: Contact[] = client.contacts.map((contact) => ({
//         clientId: response[0].insertedId,  
//         name: contact.name,
//         email:contact.email,
//         phone: contact.phone,
//         type:contact.type
//       }));
//       console.log(contactQueries)
//       const result = await db.insert(contacts).values(contactQueries);
//       console.log("Contactos agregados correctamente:", result);
//     }
//     console.log("Cliente insertado en la base de datos:", response[0].insertedId);
//     success = true;
//   } catch (error) {
//     console.error("Error al insertar cliente:", error);
//     throw error;
//   }
//   if (success) {
//     revalidatePath('/clients');
//     redirect('/clients');
//   }
// };


export async function insertClient(client: ClientFormValues) {
  const parsed = clientFormSchema.safeParse(client);
  let success = false;

  if (!parsed.success) {
    throw new Error("Error de validación del formulario");
  }

  try {
    await db.transaction(async (tx) => {
      const response = await tx.insert(clients)
        .values({
          name: client.name,
          localityId: parseInt(client.locality.id, 10),
          size: client.size,
          status: client.state,
        })
        .returning({ insertedId: clients.id });

      console.log("Cliente insertado con id:", response[0].insertedId);

      if (client.contacts && client.contacts.length > 0) {
        const contactQueries: Contact[] = client.contacts.map((contact) => ({
          clientId: response[0].insertedId,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          type: contact.type,
        }));

        console.log("Preparando inserción de contactos:", contactQueries);
        await tx.insert(contacts).values(contactQueries);

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