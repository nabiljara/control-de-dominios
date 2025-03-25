"use server"
import db from "@/db";
import { clients, contacts, domainAccess, DomainHistory, DomainInsert, domains, DomainsByExpiration, DomainWithRelations, ExpiringDomains, providers } from "@/db/schema";
import { asc, desc, eq, sql, count, lt, and, or } from "drizzle-orm";
import { setUserId, setUserSystem } from "./user-action/user-actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { decryptPassword } from "@/actions/accesses-actions";
import { createNotificationForDomains } from "./notifications-actions";
import { domainFormSchema, DomainFormValues } from "@/validators/zod-schemas";
import { format } from "date-fns";

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
        id: true,
        name: true,
        expirationDate: true,
        status: true,
        createdAt: true,
      },
      with:
      {
        client: { columns: { name: true } },
        contact: { columns: { name: true, email: true } },
        provider: { columns: { name: true } },
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


export async function updateDomain(domain: DomainFormValues, accessId: number | undefined, justUpdateAccess: boolean) {
  let success = false;
  try {

    const parsed = await domainFormSchema.parseAsync(domain);

    if (!parsed) {
      throw new Error("Error de validación del formulario del dominio.");
    }
    await db.transaction(async (tx) => {

      await setUserId(tx)

      if (!parsed.id) {
        throw new Error("El ID del dominio no está definido.");
      }
      if (!justUpdateAccess) {
        const domainUpdate: DomainInsert = {
          name: parsed.name.toLowerCase(),
          providerId: parseInt(parsed.provider.id),
          clientId: parseInt(parsed.client.id),
          contactId: parseInt(parsed.contactId),
          expirationDate: format(parsed.expirationDate, "yyyy-MM-dd HH:mm"),
          status: parsed.status,
        }
        await tx.update(domains)
          .set(domainUpdate)
          .where(eq(domains.id, parsed.id))
      }

      //Busco si el dominio tiene un acceso asociado
      const response = await db.query.domainAccess.findFirst({ where: eq(domainAccess.domainId, parsed.id) })

      //Si tiene acceso asociado y no se seleccionó un acceso, elimino la asociación
      if (response && !accessId) {

        await tx.delete(domainAccess)
          .where(eq(domainAccess.domainId, parsed.id));
      }
      //Si no tiene acceso asociado y se seleccionó un acceso, creo la asociación
      else if (accessId) {
        if (!response) {

          await tx.insert(domainAccess)
            .values({
              domainId: parsed.id,
              accessId
            });
        }
        //Si tiene acceso asociado, se seleccionó un acceso y este es diferente al que ya tiene, actualizo la asociación
        else if (response.accessId !== accessId) {

          await tx.update(domainAccess)
            .set({
              domainId: parsed.id,
              accessId
            })
            .where(eq(domainAccess.domainId, parsed.id));
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


export async function updateDomainCron(id: number) {
  try {
    //Para el cron job, se setea el userId del usuario SISTEMA (desde seed)
    await db.transaction(async (tx) => {
      await setUserSystem(tx)
      if (!id) {
        throw new Error("El ID del dominio no está definido.");
      }
      await tx.update(domains)
        .set({ status: 'Vencido' })
        .where(eq(domains.id, id))
    });
  }
  catch (error) {
    console.error("Error al modificar el estado del dominio por CronJob: ", error);
    throw error;
  }
};

export async function getAccessDomain(domainId: number) {
  try {
    const response = await db.query.domainAccess.findFirst({ where: eq(domainAccess.domainId, domainId) })
    return response
  }
  catch (error) {
    console.log("Hubo un error al obtener el acceso del dominio: ", error)

  }
}
export async function insertDomain(domain: DomainFormValues, accessId: number | undefined) {
  let success = false;
  try {
    const parsed = await domainFormSchema.parseAsync(domain);

    if (!parsed) {
      throw new Error("Error de validación del formulario del dominio.");
    }

    const domainInsert: DomainInsert = {
      name: parsed.name.toLowerCase(),
      providerId: parseInt(parsed.provider.id),
      clientId: parseInt(parsed.client.id),
      contactId: parseInt(parsed.contactId),
      expirationDate: format(parsed.expirationDate, "yyyy-MM-dd HH:mm"),
      status: parsed.status,
    }

    await db.transaction(async (tx) => {
      await setUserId(tx)
      const response = await tx.insert(domains)
        .values(domainInsert)
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

export async function getActiveDomainsByExpiration() {
  try {
    const expiringDomains = await db.query.domains.findMany({
      columns: {
        expirationDate: true,
        id: true,
        clientId: true,
        name: true
      },
      where: and(
        eq(domains.status, 'Activo'),
        or(
          eq(domains.expirationDate, sql`CURRENT_DATE`),
          eq(domains.expirationDate, sql`CURRENT_DATE + INTERVAL '7 days'`),
          eq(domains.expirationDate, sql`CURRENT_DATE + INTERVAL '30 days'`)
        )
      ),
      orderBy: asc(domains.expirationDate),
      with: {
        client: { columns: { id: true, name: true } },
        contact: { columns: { email: true } },
      }
    });

    const domainsByExpiration: DomainsByExpiration = {
      expiringToday: [],
      expiring7days: [],
      expiring30days: []
    };

    expiringDomains.forEach((domain: ExpiringDomains) => {
      const expirationDate = new Date(domain.expirationDate);
      expirationDate.setHours(0, 0, 0, 0);

      const diffInMs = expirationDate.getTime() - Date.now();
      const daysRemaining = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

      if (daysRemaining === 0) {
        domainsByExpiration.expiringToday.push(domain);
      } else if (daysRemaining === 7) {
        domainsByExpiration.expiring7days.push(domain);
      } else if (daysRemaining === 30) {
        domainsByExpiration.expiring30days.push(domain);
      }
    });

    return domainsByExpiration;

  } catch (error) {
    console.error("Error al obtener los dominios próximos a vencer: ", error);
    throw error;
  }
}

export async function getExpiredActiveDomains() {
  try {

    const expiredDomains = await db.query.domains.findMany({
      columns: {
        expirationDate: true,
        id: true,
        clientId: true,
        name: true
      },
      where: and(
        eq(domains.status, 'Activo'),
        lt(domains.expirationDate, sql`CURRENT_DATE`)
      ),
      orderBy: asc(domains.expirationDate),
      with: {
        client: { columns: { id: true, name: true } },
        contact: { columns: { email: true } },
      }
    });

    return expiredDomains;

  } catch (error) {
    console.error("Error al obtener los dominios activos vencidos:", error);
    throw error;
  }
}
export async function getLastExpiringDomains() {
  try {

    const expiringDomains = await db.query.domains.findMany({
      columns: {
        expirationDate: true,
        id: true,
        name: true
      },
      where: and(
        eq(domains.status, 'Activo'),
      ),
      orderBy: asc(domains.expirationDate), 
      limit: 6,
      with: {
        client: true
      }
    });

    return expiringDomains;

  } catch (error) {
    console.error("Error al obtener los dominios activos vencidos:", error);
    throw error;
  }
}

export async function getDashboardData() {
  try {
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
      const prevMonthStr =  registeredPerMonth[1]?.month;
      const currentMonthStr = registeredPerMonth[0]?.month;

      if (typeof prevMonthStr === "string" && typeof currentMonthStr === "string") {
        const prevMonth = new Date(prevMonthStr);
        const currentMonth = new Date(currentMonthStr);

        const isConsecutive =
        currentMonth.getFullYear() === prevMonth.getFullYear()
        ? currentMonth.getMonth() - prevMonth.getMonth() === 1
        : currentMonth.getMonth() === 0 && prevMonth.getMonth() === 11;
        
        if (isConsecutive) {
            const lastMonthCount = registeredPerMonth[0]?.count ?? 0;
            const previousMonthCount = registeredPerMonth[1]?.count ?? 1;
            growthPercentage = ((lastMonthCount - previousMonthCount) / previousMonthCount) * 100;
        } else {
            growthPercentage = 0;
          }
      }
  }
    return {
      total: totalDomains,
      active: totalActive,
      expired: totalExpired,
      growthPercentage: Math.round(growthPercentage * 100) / 100,
    };
  }
  catch (error) {
    console.error("Error al obtener información de los dominios:", error);
    throw error;
  }
}
export async function getRegisteredPerMonthData() {
  try {
    const registeredPerMonth = await db.select({
      month: sql`DATE_TRUNC('month', CAST(${domains.createdAt} AS TIMESTAMP))`.as("month"),
      count: count(),
    })
      .from(domains)
      .groupBy(sql`DATE_TRUNC('month', CAST(${domains.createdAt} AS TIMESTAMP))`)
      .orderBy(sql`DATE_TRUNC('month', CAST(${domains.createdAt} AS TIMESTAMP)) DESC`);
    return registeredPerMonth;
  } catch (error) {
    console.error("Error al obtener dominios registrados por mes:", error);
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
export async function updateDomainsState(doms: ExpiringDomains[]) {
  try {
    await Promise.all(doms.map(async (dom) => {
      try {
        await updateDomainCron(dom.id);
      } catch (error) {
        console.error(`Error al modificar el estado del dominio ${dom.name}:`, error);
      }
    }));
    await createNotificationForDomains(doms, 'Vencido');
    return "Dominios vencidos actualizados correctamente";
  } catch (error) {
    console.error('Error al actualizar el estado de los dominios:', error);
  }
}

export async function getDomainAccessDetail(domAccId: number) {
  try {
    const data = await db.query.domainAccess.findFirst({
      where: eq(domainAccess.id, domAccId),
      with: {
        domain: {
          with: {
            client: true,
            provider: true
          }
        },
        access: {
          with: {
            provider: true,
            client: true
          }
        }
      }
    });
    return data
  } catch (error) {
    console.error('Error al obtener el domainAccess:', error);
  }
}