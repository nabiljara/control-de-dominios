"use server"
import db from "@/db";
import { domains } from "@/db/schema";
import { desc , eq, or} from "drizzle-orm";
import { ContactPerDomain } from "../../types/contact-types";


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

export async function updateDomainContact(contactDomain : ContactPerDomain[]) {
    try{
        contactDomain.map(async (contact) => {
            // console.log("CONTACTO ID: ", contact.contactId)
            // console.log("DOMINIO ID: ", contact.domainId)
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
