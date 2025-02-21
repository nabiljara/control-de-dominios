"use server"
import { entityMap } from "@/constants";
import db from "@/db";
import { audits, AuditWithRelations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getAuditProvider, getProvider } from "./provider-actions";
import { getContact } from "./contacts-actions";
import { getAuditDomain, getDomain } from "./domains-actions";
import { getAuditClient, getClient } from "./client-actions";
import { getUser } from "./user-action/user-actions";
import { getAccess } from "./accesses-actions";
import { getLocality } from "./locality-actions";

export async function getAudits() {
  try {
    const data = await db.query.audits.findMany({
      orderBy: [desc(audits.id)],
      with: {
        user: {
          columns: {
            name: true
          }
        }
      }
    });
    return data;
  }
  catch (error) {
    console.error("Error al obtener proveedores:", error);
    throw error;
  }
};
export async function getAudit(id: number): Promise<AuditWithRelations> {
  try {
    const aud = await db.query.audits.findFirst({
      where: eq(audits.id, id),
      with: {
        audit_details: true,
        user: {
          columns: {
            name: true,
          }
        },
      }
    });

    if (!aud) {
      throw new Error("Auditoría no encontrada");
    }
    const entityDetails = await getEntityDetails(aud.entity as keyof typeof entityMap, aud.entityId);
    return { ...aud, entityDetails } as AuditWithRelations;
  }
  catch (error) {
    console.error("Error al obtener la auditoría:", error);
    throw error;
  }
};

async function getEntityDetails(entity: keyof typeof entityMap, entityId: string) {

  try {
    const tableName = entityMap[entity];
    if (!tableName) {
      throw new Error(`No se encontró mapeo para la entidad: ${entity}`);
    }
    let result;
    switch (tableName) {
      case 'providers':
        result = getAuditProvider(Number(entityId));
        break;
      case 'contacts':
        result = getContact(Number(entityId)); //TODO: CAMBIAR A GetAuditContact Para no traer los dominios
        break;
      case 'domains':
        result = getAuditDomain(Number(entityId));
        break;
      case 'clients':
        result = getAuditClient(Number(entityId));
        break;
      case 'users':
        result = getUser(entityId);
        break;
      case 'access':
        result = getAccess(Number(entityId));
        break;
      case 'localities':
        result = getLocality(Number(entityId));
        break;
      default:
        throw new Error(`No se configuró lógica para la tabla: ${tableName}`);
    }
    return result;
  } catch (error) {
    console.error("Error al obtener el detalle de la entidad de la auditoría:", error);
    throw error;
  }
}