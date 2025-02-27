"use server"
import db from "@/db";
import { clients, contacts, domainAccess, DomainHistory, DomainInsert, domains, DomainWithRelations, providers } from "@/db/schema";
import { asc, desc, eq, or, sql, count, lt } from "drizzle-orm";
import { setUserId, setUserSystem } from "./user-action/user-actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { decryptPassword } from "@/actions/accesses-actions";


export async function getDomains() {
  try {
    const data = await db.query.domains.findMany({
      orderBy: [asc(domains.expirationDate)],
      with: {
        provider: {
          columns: {
            id: true,
            name: true,
          }
        },
        client: {
          columns: {
            id: true,
            name: true,
          }
        }
      }
    });
    return data;
  }
  catch (error) {
    console.error("Error al obtener los dominios:", error);
    throw error;
  }
};

export async function getDomain(id: number): Promise<DomainWithRelations | undefined> {
  try {
    const domain = await db.query.domains.findFirst({
      where: eq(domains.id, id),
      with:
      {
        client: true,
        contact: true,
        provider: true,
        history: {
          orderBy: (history, { desc }) => [desc(history.startDate)],
        },
        accessData: {
          with: {
            access: {
              with: {
                provider: true
              }
            }
          }
        }
      }
    });
    if (domain?.accessData) {
      const decryptedPassword = decryptPassword(domain.accessData.access.password)
      domain.accessData.access.password = decryptedPassword ? decryptedPassword : '';
    }
    return domain;
  }
  catch (error) {
    console.error("Error al obtener el dominio:", error);
    throw error;
  }
};

export async function getAuditDomain(id: number) {
  try {
    if (!id) {
      throw new Error(`El id del dominio no está definido`);
    }
    const domain = await db.query.domains.findFirst({
      where: eq(domains.id, id),
      columns: {
        id:true,
        name: true,
        expirationDate: true,
        status: true,
        createdAt: true,
      },
      with:
      {
        client: {columns: {name: true}},
        contact: {columns: {name: true, email: true}},
        provider: {columns: {name: true}},
      }
    });
    return domain;
  }
  catch (error) {
    console.error("Error al obtener el dominio:", error);
    throw error;
  }
};


export async function getDomainsByContact(idContact: number) {
  try {
    const data = await db.query.domains.findMany({
      where: eq(domains.contactId, idContact),
      orderBy: [desc(domains.id)],
      with: {
        provider: true,
        client: true,
      }
    });
    return data;
  }
  catch (error) {
    console.error("Error al obtener los dominios:", error);
    throw error;
  }
};


export async function updateDomainContact(selectedContacts: Record<number, number>) {
  try {
    Object.entries(selectedContacts).map(async ([domainId, contactId]) => {
      await setUserId()
      await db.update(domains)
        .set({ contactId: contactId })
        .where(eq(domains.id, Number(domainId)))
    })
  }
  catch (error) {
    console.error("Error al actualizar el o los contactos del dominios:", error);
    throw error;
  }
};

export async function updateDomain(domain: DomainInsert, accessId: number | undefined) {
  let success = false;
  try {
    await setUserId()
    await db.transaction(async (tx) => {

      if (!domain.id) {
        throw new Error("El ID del dominio no está definido.");
      }

      await tx.update(domains)
        .set(domain)
        .where(eq(domains.id, domain.id))

      //Busco si el dominio tiene un acceso asociado
      const response = await db.query.domainAccess.findFirst({ where: eq(domainAccess.domainId, domain.id) })

      //Si tiene acceso asociado y no se seleccionó un acceso, elimino la asociación
      if (response && !accessId) {
        await tx.delete(domainAccess)
          .where(eq(domainAccess.domainId, domain.id));
      }
      //Si no tiene acceso asociado y se seleccionó un acceso, creo la asociación
      else if (accessId) { 
        if (!response) {
          await tx.insert(domainAccess)
            .values({
              domainId: domain.id,
              accessId
            });
        }
        //Si tiene acceso asociado, se seleccionó un acceso y este es diferente al que ya tiene, actualizo la asociación
        else if (response.accessId !== accessId) {
          await tx.update(domainAccess)
            .set({
              domainId: domain.id,
              accessId
            })
            .where(eq(domainAccess.domainId, domain.id));
        }
      }
    });
    success = true;
  }
  catch (error) {
    console.error("Error al modificar el dominio:", error);
    throw error;
  }
  if (success) {
    revalidatePath(`/domains/${domain.id}`);
  }
};


export async function updateDomainCron(domain: DomainInsert) {
  let success = false;
  try {
    //Para el cron job, se setea el userId del usuario SISTEMA (desde seed)
    await setUserSystem()
    await db.transaction(async (tx) => {

      if (!domain.id) {
        throw new Error("El ID del dominio no está definido.");
      }
      //Solo módifico el dominio, no toca ni modifica nada de las relaciones 
      await tx.update(domains)
        .set(domain)
        .where(eq(domains.id, domain.id))
    });
    success = true;
  }
  catch (error) {
    console.error("Error al modificar el dominio:", error);
    throw error;
  }
  return success;
};

export async function getAccessDomain(domainId: number){
  try{
    const response = await db.query.domainAccess.findFirst({ where: eq(domainAccess.domainId, domainId) })
    return response
  }
  catch(error){
    console.log("Hubo un error al obtener el acceso del dominio: ", error)

  }
}
export async function insertDomain(domain: DomainInsert, accessId: number | undefined) {
  let success = false;
  try {
    await setUserId()
    await db.transaction(async (tx) => {
      const response = await tx.insert(domains)
        .values({
          name: domain.name,
          expirationDate: domain.expirationDate,
          status: domain.status,
          clientId: domain.clientId,
          providerId: domain.providerId,
          contactId: domain.contactId,
        })
        .returning({ insertedId: domains.id });
      if (accessId) {
        await tx.insert(domainAccess)
          .values({
            domainId: response[0].insertedId,
            accessId
          });
      }
    });
    success = true
  }
  catch (error) {
    console.error("Error al crear el dominio:", error);
    throw error;
  }
  if (success) {
    revalidatePath('/domains');
    redirect('/domains');
  }
};

export async function getDomainHistory(history: DomainHistory[]) {
  try {
    const providersHistory = [];
    const contactsHistory = [];
    const clientsHistory = [];

    for (const item of history) {
      let data;
      switch (item.entity) {
        case 'Proveedores':
          data = await db.query.providers.findFirst({
            where: eq(providers.id, item.entityId),
          });
          if (data) providersHistory.push({ ...item, data });
          break;
        case 'Contactos':
          data = await db.query.contacts.findFirst({
            where: eq(contacts.id, item.entityId),
          });
          if (data) contactsHistory.push({ ...item, data });
          break;
        case 'Clientes':
          data = await db.query.clients.findFirst({
            where: eq(clients.id, item.entityId),
            with: {
              locality: true
            }
          });
          if (data) clientsHistory.push({ ...item, data });
          break;
        default:
          break;
      }
    }
    return {
      providersHistory,
      contactsHistory,
      clientsHistory
    };
  } catch (error) {
    console.error("Error al obtener el historial del dominio:", error);
    throw error;
  }
}

export async function getExpiringDomains(){
  const today = Date.now();
  try{
    const data = await db.query.domains.findMany({
      where: 
        eq(domains.status, 'Activo'),
        with: {
          provider: true,
          client: true,
        }
    });

    const expiringDomains = data.filter((domain) => {
      const expirationDate = new Date(domain.expirationDate);
      expirationDate.setHours(0, 0, 0, 0);      
      const diffInMs = expirationDate.getTime() - today.valueOf();
      const daysRemaining = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      // console.log("Expira en ", daysRemaining, " días");
      return daysRemaining >= 0 ;
    }).sort((a, b)=> new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());
    const expiredDomains = data.filter((domain) => {
      const expirationDate = new Date(domain.expirationDate);
      expirationDate.setHours(0, 0, 0, 0);      
      const diffInMs = expirationDate.getTime() - today.valueOf();
      const daysRemaining = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
      return daysRemaining <= 0 ;
    });
    
    return {expiringDomains, expiredDomains};
  }
  catch (error) {
    console.error("Error al obtener los dominios:", error);
    throw error;
  }
}

export async function getDashboardData(){
  try{
    const result = await Promise.all([
      db.select({ count: count() }).from(domains),
      db.select({ count: count() }).from(domains).where(eq(domains.status, "Activo")),
      db.select({ count: count() }).from(domains).where(lt(domains.expirationDate, new Date().toISOString())),
      db.select({
        month: sql`DATE_TRUNC('month', CAST(${domains.createdAt} AS TIMESTAMP))`.as("month"),
        count: count(),
      })
        .from(domains)
        .groupBy(sql`DATE_TRUNC('month', CAST(${domains.createdAt} AS TIMESTAMP))`)
        .orderBy(sql`DATE_TRUNC('month', CAST(${domains.createdAt} AS TIMESTAMP)) DESC`)
    ]);
    const totalDomains = result[0][0]?.count ?? 0;
    const totalActive = result[1][0]?.count ?? 0;
    const totalExpired = result[2][0]?.count ?? 0;
    const registeredPerMonth = result[3] ?? [];

    //crecimiento
    let growthPercentage = 0;
    if (registeredPerMonth.length > 1) {
      const lastMonth = registeredPerMonth[0]?.count ?? 0;
      const previousMonth = registeredPerMonth[1]?.count ?? 1; 
      growthPercentage = ((lastMonth - previousMonth) / previousMonth) * 100;
    }
    return {
      total: totalDomains,
      active: totalActive,
      expired: totalExpired,
      registeredPerMonth,
      growthPercentage: Math.round(growthPercentage * 100) / 100, 
    };
  }
  catch (error) {
    console.error("Error al obtener información de los dominios:", error);
    throw error;
  }
}

/**
 * Validates a domain name against the system's criteria and checks if it is already registered.
 *
 * @param domain - The domain name to be validated.
 * @param oldDomain - The previous domain name, if any, to compare against.
 * @returns A promise that resolves to an array of error objects, each containing a field and a message.
 * @throws Will throw an error if the validation process fails.
 */
export const validateDomain = async (domainName: string, oldDomainName: string | undefined) => {
  try {
    const errorList: { field: "name"; message: string }[] = [];
    const domainIsValid = await validateDomainName(domainName);
    if (!domainIsValid && domainName !== oldDomainName) {
      errorList.push({
        field: "name",
        message: "El nombre de dominio ya está registrado en el sistema.",
      });
    }
    return errorList;
  } catch (error) {
    console.error("Error al validar el dominio: ", error)
    throw error;
  }
}

async function validateDomainName(name: string) {
  try {
    const response = await db.query.domains.findFirst({
      where: eq(domains.name, name)
    });
    return response ? false : true;
  } catch (error) {
    console.error("Error al validar el email")
  }
}
