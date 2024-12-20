"use server"
import db from "@/db";
import { DomainInsert, domains } from "@/db/schema";
import { desc , eq, or} from "drizzle-orm";
import { ContactPerDomain } from "../../types/contact-types";
import { setUserId } from "./user-action/user-actions";


export async function getDomains() {
    try{
        const data = await db.query.domains.findMany({
          orderBy: [desc(domains.id)],
          with:{
            provider:{
                columns:{
                    name:true,
                }
            },
            client:{
                columns:{
                    name:true,
                }
            }
          }
        });
        return data;
    }
    catch(error){
        console.error("Error al obtener los dominios:", error);
        throw error;
    }
};

export async function getDomainsByContact(idContact: number){
    try{
        const data = await db.query.domains.findMany({
          where: eq(domains.contactId, idContact),
          orderBy: [desc(domains.id)],
          with:{
            provider:true,
            client:true,
        }
    });
        return data;
    }
    catch(error){
        console.error("Error al obtener los dominios:", error);
        throw error;
    }
};

export async function updateDomain(domain : DomainInsert) {
    try{
        if(!domain.id){
            throw new Error("El ID del dominio no está definido.");
        }
        await setUserId()
        await db.update(domains)
        .set({ name: domain.name, expirationDate: domain.expirationDate, status: domain.status, updatedAt: (new Date()).toISOString(), clientId: domain.clientId, providerId: domain.providerId, contactId: domain.contactId , providerRegistrationDate: domain.providerRegistrationDate })
        .where(eq(domains.id, domain.id)).returning({ id: domains.id });
    }
    catch(error){
        console.error("Error al modificar el dominio:", error);
        throw error;
    }
};

export async function updateDomainContact(contactDomain : ContactPerDomain[]) {
    try{
        contactDomain.map(async (contact) => {
            await db.update(domains)
            .set({ contactId: contact.contactId })
            .where(eq(domains.id, contact.domainId)).returning({ id: domains.id });
        })
    }
    catch(error){
        console.error("Error al obtener los dominios:", error);
        throw error;
    }
};
