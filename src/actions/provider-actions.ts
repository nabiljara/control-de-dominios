"use server"
import db from "@/db";
import { providers } from "@/db/schema";
import { and, desc, eq, not, or } from "drizzle-orm";
import { Provider, ProviderInsert } from "@/db/schema";
import { setUserId } from "./user-action/user-actions";
import { ProviderWithRelations } from "@/db/schema";

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
export async function updateProvider(providerData: Omit<ProviderWithRelations, 'access'>) {
  try {
    await setUserId()
    console.log(providerData)
    const existingName = await db.query.providers.findFirst({
      where: and(eq(providers.name, providerData.name), not(eq(providers.id, providerData.id))),
    })
    const existingUrl = await db.query.providers.findFirst({
      where: and(eq(providers.url, providerData.url), not(eq(providers.id, providerData.id))),
    })

    if (existingName) {
      throw new Error("Ya existe un proveedor con el mismo nombre");
    }
    if (existingUrl) {
      throw new Error("Ya existe un proveedor con el mismo url");
    }

    await db.update(providers) 
        .set({ name: providerData.name, url: providerData.url})
        .where(eq(providers.id, providerData.id)).returning({ id: providers.id });
    
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

export async function insertProvider(provider: ProviderInsert) {
  try {
    const existingName = await db.query.providers.findFirst({
      where: eq(providers.name, provider.name),
    })
    const existingUrl = await db.query.providers.findFirst({
      where: eq(providers.url, provider.url),
    })

    if (existingName) {
      throw new Error("Ya existe un proveedor con el mismo nombre");
    }
    if (existingUrl) {
      throw new Error("Ya existe un proveedor con el mismo url");
    }
    
    await setUserId()
    const result = await db.insert(providers).values(provider).returning();
    return result;
  } catch (error) {
    throw error;
  }
};