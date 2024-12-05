"use server"
import db from "@/db";
import { sql } from "@/db";
import { providers } from "@/db/schema";
import { z } from "zod";
import { desc, eq, or } from "drizzle-orm";
import { auth } from "../auth"
const providerSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .max(30, { message: "El nombre debe tener como máximo 30 caracteres" })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  url: z.string().refine((url) => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(url), {
    message: "URL inválida",
  }),
});

const domainSchema = z.object({
  name: z.string(),
  status: z.enum(["active", "inactive", "suspended"]),
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  clientId: z.number(),
  providerId: z.number(),
  contactId: z.number(),
  providerRegistrationDate: z.string(),
  expirationDate: z.string(),
});

const providerUpdateSchema = z.object({
  id: z.number(),
  name: z.string().max(30, { message: "El nombre debe tener como máximo 30 caracteres" }).min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  url: z.string().refine((url) => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(url), {
    message: "URL inválida",
  }),
  domains: z.array(domainSchema),
});
type ProviderUpdate = z.infer<typeof providerUpdateSchema>;
export type Provider = z.infer<typeof providerSchema>;

export async function getProviders() {
  try {
    const data = await db.query.providers.findMany({
      orderBy: [desc(providers.id)],
    });
    return data;
  }
  catch (error) {
    console.error("Error al obtener proveedores:", error);
    throw error;
  }
};
export async function getProvider(id: number) {
  try {
    const prov = await db.query.providers.findFirst({
      where: eq(providers.id, id),
      with:
        { domains: true }
    });
    return prov;
  }
  catch (error) {
    console.error("Error al obtener el proveedor:", error);
    throw error;
  }
};
export async function updateProvider(providerData: ProviderUpdate) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      throw new Error("Usuario no autenticado");
    }
    const userId = session.user.id;

    await sql.transaction([
      sql`
        SELECT set_user_id(${userId})
      `,
      sql`
        UPDATE providers
        SET name = ${providerData.name}, url = ${providerData.url}
        WHERE id = ${providerData.id}
      `
    ]);
    const updatedProvider = await db.query.providers.findFirst({
      where: eq(providers.id, providerData.id),
      with: {
        domains: true,
      },
    });

    return updatedProvider;
  }
  catch (error) {
    console.error("Error al actualizar el proveedor:", error);
    throw error;
  }
};

export async function insertProvider(provider: Provider) {
  try {
    const session = await auth()

    if (!session || !session.user) {
      throw new Error("Usuario no autenticado");
    }
    const userId = session.user.id;

    const existingProvider = await db.query.providers.findFirst({
      where: or(eq(providers.name, provider.name), eq(providers.url, provider.url))
    })
    if (existingProvider) {
      throw new Error("El proveedor ya existe");
    }

    const result = await sql.transaction([
      sql`
          SELECT set_user_id(${userId})
        `,
      sql`
          INSERT INTO providers (name, url)
          VALUES (${provider.name}, ${provider.url})
          RETURNING *
        `
    ]);
    const insertedProvider = result[1];
    // console.log("Proveedor insertado en la base de datos:", insertedProvider);
    return insertedProvider;
  } catch (error) {
    // console.error("Error al insertar proveedor:", error);
    throw error;
  }
};