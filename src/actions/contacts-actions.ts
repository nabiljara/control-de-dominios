"use server"
import db from "@/db";
import { contacts, Contact } from "@/db/schema";
import { desc , eq, or} from "drizzle-orm";

export async function getContacts() {
    try{
        const data = await db.query.contacts.findMany({
          orderBy: [desc(contacts.id)],
          with:{
            client:{
                columns:{
                  name:true
                }
              }
          }
        });
        return data;
    }
    catch(error){
        console.error("Error al obtener los contactos:", error);
        throw error;
    }
};

export async function insertContact(contact : Contact) {
    try{
        const phone = contact.phone ? contact.phone.trim() : null;
        let existingContactPhone = null;
        if (phone) {
            existingContactPhone = await db.query.contacts.findFirst({
                where: eq(contacts.phone, phone)
            });
        }   
        const existingContactEmail = await db.query.contacts.findFirst({
            where: 
                eq(contacts.email, contact.email),
                
        })
        if (existingContactEmail) {
            throw new Error("El email ya esta registrado en el sistema.");
        }
        if (existingContactPhone) {
            throw new Error("El teléfono ya esta registrado en el sistema.");
        }
        const data = await db.insert(contacts).values(contact).returning();
        return data;
    }
    catch(error){
        console.error("Error al obtener los contactos:", error);
        throw error;
    }
};
export async function updateContact(contact : Contact) {
    try{
        if (!contact.id) {
            throw new Error("El ID del contacto no está definido.");
          }
        const actualContact = await getContact(contact.id);
        if(actualContact?.email != contact.email){
            const existingEmail = await validateEmail(contact.email);
            if (!existingEmail) {
                throw new Error("El email ya esta registrado en el sistema.");
            }
        }
        if (actualContact?.phone != contact.phone){
            const existingPhone = await validatePhone(contact.phone?.toString());
            if (!existingPhone) {
                throw new Error("El teléfono ya esta registrado en el sistema.");
            }
        }
        const updatedContact = await db.update(contacts)
        .set({ name: contact.name, email: contact.email, phone: contact.phone, type: contact.type, status: contact.status, clientId: contact.clientId, updatedAt: new Date().toISOString() })
        .where(eq(contacts.id, contact.id)).returning({ id: contacts.id });

        return updatedContact[0];
    }
    catch(error){
        console.error("Error al modificar el contacto:", error);
        throw error;
    }
};

export async function getContact(id:number  ) {
    try{
        const data = await db.query.contacts.findFirst({
            where: eq(contacts.id, id),
            columns:{
                id:true,
                name:true,
                email:true,
                phone:true,
                type:true,
                status:true,
                clientId:true,
            },
            with:{
            client:{
                columns:
                    {
                        id:true,
                        name:true,
                    }
                }
          }
        });
        return data;
    }
    catch(error){
        console.error("Error al obtener el contacto:", error);
        throw error;
    }
};

export async function validatePhone(phone: string | undefined) {
    try {
        if (!phone) return true
        const response = await db.query.contacts.findFirst({
            where: eq(contacts.phone, phone)
        });
        return response ? false : true;
    } catch (error) {
        console.error("Error al validar el email", error)
        throw error
    }
}

export async function validateEmail(email: string) {
    try {
        const response = await db.query.contacts.findFirst({
            where: eq(contacts.email, email)
        });
        console.log(response);
        return response ? false : true;
    } catch (error) {
        console.error("Error al validar el email")
    }
}