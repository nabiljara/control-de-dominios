"use server"

import db, { sql } from "@/db";
import { auth } from "../auth"
import { clientFormSchema, ClientFormValues } from "@/validators/client-validator";
import { clients } from "@/db/schema";
import { desc } from "drizzle-orm";

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

export async function insertClient(client: ClientFormValues) {
  const parsed = clientFormSchema.safeParse(client);
  try {
    if (!parsed.success) {
      throw new Error("Error de validación del formulario");
    }
    const session = await auth()
    if (!session || !session.user) {
      throw new Error("Usuario no autenticado");
    }
    const userId = session.user.id;

    const result = await sql.transaction([
      sql`
          SELECT set_user_id(${userId})
        `,
      sql`
          INSERT INTO clients (name, locality_id, size, status)
          VALUES (${client.name}, ${parseInt(client.locality.id, 10)}, ${client.size}, ${client.state})
          RETURNING *
        `
    ]);
    const insertedClient = result[1];
    console.log("Cliente insertado en la base de datos:", insertedClient);
    console.log(client);
    return { success: true };
  } catch (error) {
    console.error("Error al insertar cliente:", error);
    throw error;
  }
};