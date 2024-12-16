"use server"
import db from "@/db";
import { providers } from "@/db/schema";
import { desc, eq, or } from "drizzle-orm";
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
    const existingProvider = await db.query.providers.findFirst({
      where: or(eq(providers.name, provider.name), eq(providers.url, provider.url))
    })
    if (existingProvider) {
      throw new Error("El proveedor ya existe");
    }
    console.log(provider)
    await setUserId()
    const result = await db.insert(providers).values(provider).returning();
    return result;
  } catch (error) {
    // console.error("Error al insertar proveedor:", error);
    throw error;
  }
};