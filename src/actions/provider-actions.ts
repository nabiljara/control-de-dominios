"use server"
import db from "@/db";
import { providers } from "@/db/schema";
import { desc, eq, ilike } from "drizzle-orm";
import { setUserId } from "./user-action/user-actions";
import { revalidatePath } from "next/cache";
import { ProviderFormValues, providerSchema } from "@/validators/client-validator";

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

export async function getAuditProvider(id: number) {
  try {
    if (!id) {
      throw new Error(`El id no está definido`);
    }
    const provider = await db.query.providers.findFirst({
      where: eq(providers.id, id),
    });
    return provider;
  }
  catch (error) {
    console.error("Error al obtener el proveedor:", error);
    throw error;
  }
};

export async function updateProvider(provider: ProviderFormValues) {
  let success = false;
  try {
    if (!provider.id) {
      throw new Error("El ID del proveedor no está definido.");
    }
    await setUserId()
    await db.update(providers)
      .set({ name: provider.name, url: provider.url })
      .where(eq(providers.id, provider.id))
    success = true;
  } catch (error) {
    console.error("Error al modificar el proveedor:", error);
    throw error;
  }
  if (success) {
    revalidatePath(`/providers/${provider.id}`);
  }
}

export async function insertProvider(provider: ProviderFormValues) {
  let success = false;
  try {
    const parsed = providerSchema.safeParse(provider);

    if (!parsed.success) {
      throw new Error("Error al validar los datos del proveedor");
    }
    await setUserId()
    await db.insert(providers).values({ name: provider.name.trim(), url: provider.url.trim() });
    success = true
  }
  catch (error) {
    console.error("Error al registrar el proveedor:", error);
    throw error;
  }
  if (success) {
    revalidatePath('/providers');
  }
};

export async function validateProviderURL(url: string) {
  try {
    const response = await db.query.providers.findFirst({
      where: ilike(providers.url, url)
    });
    return response ? false : true;
  } catch (error) {
    console.error("Error al validar la url del proveedor")
    throw error
  }
}

export async function validateProviderName(name: string) {
  try {
    const response = await db.query.providers.findFirst({
      where: ilike(providers.name, name)
    });
    return response ? false : true;
  } catch (error) {
    console.error("Error al validar el nombre del proveedor")
    throw error
  }
}