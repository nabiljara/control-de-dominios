"use server"
import db from "@/db";
import { domainHistory, domains, providers } from "@/db/schema";
import { and, count, desc, eq, ilike, sql } from "drizzle-orm";
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

export async function getDashboardData(){
  try{
    const result = await Promise.all([
      //total prov
      db.select({ count: count() }).from(providers),

      // total x prov
      db.select({
        providerId: providers.id,
        providerName: providers.name,
        domainCount: sql<number>`COUNT(domain_history.id)`.as("domainCount"),
      })
        .from(providers)
        .leftJoin(domainHistory, and(
          eq(domainHistory.entity, "Proveedores"),
          eq(domainHistory.entityId, providers.id),
          eq(domainHistory.active, true)
        ))
        .groupBy(providers.id)
    ]);
    const total = result[0][0]?.count ?? 0;
    const domainsPerProvider = result[1] ?? [];

    const formattedChartData = domainsPerProvider.map((provider, index) => ({
      proveedor: provider.providerName,
      dominios: provider.domainCount,
      fill: `hsl(var(--chart-${index + 1}))`, 
    }));

    return {
      total,
      domainsPerProvider: formattedChartData,
    };
  }catch (error) {
    console.error("Error al obtener los datos de proveedores:", error);
    throw error;
  }
}

export async function getDomainsByProviderAndMonth(){
  try{
    const result = await db
      .select({
        month: sql`DATE_TRUNC('month', ${domains.createdAt})`.as("month"),
        providerName: providers.name,
        domainCount: count(),
      })
      .from(domainHistory)
      .innerJoin(domains, sql`${domainHistory.domainId} = ${domains.id}`)
      .innerJoin(providers, sql`${domainHistory.entityId} = ${providers.id}`)
      .where(and(
        eq(domainHistory.entity, "Proveedores"),
        eq(domainHistory.active, true)
      ))
      .groupBy(sql`DATE_TRUNC('month', ${domains.createdAt})`, providers.name)
      .orderBy(sql`DATE_TRUNC('month', ${domains.createdAt}) DESC`);

    const formattedData = result.map((row) => ({
      month: new Date(row.month as string),
      providerName: row.providerName,
      domainCount: row.domainCount,
    })).sort((a, b) => a.month.getTime() - b.month.getTime());

    const sortedFormattedData = formattedData.map((item) =>({
      month: item.month.toLocaleDateString("es-ES", {
        month: "2-digit",
        year: "2-digit",
      }),
      providerName: item.providerName,
      domainCount: item.domainCount,
      }))
    
    
    const transformedData = sortedFormattedData.reduce((acc, item) => {
        const existingEntry = acc.find((entry) => entry.month === item.month);
      
        if (existingEntry) {
          existingEntry[item.providerName.toLowerCase()] = item.domainCount;
        } else {
          acc.push({
            month: item.month,
            [item.providerName.toLowerCase()]: item.domainCount,
          });
        }
      
        return acc;
      }, [] as Record<string, string|number>[]);

    return Object.values(transformedData);
  }catch(error){
    console.log("Error al obtener los dominios por proveedor y mes: ",error)
  }
}