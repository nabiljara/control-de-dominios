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

export async function getContact(id:number) {
    try{
        const data = await db.query.contacts.findFirst({
            where: eq(contacts.id, id),
            with:{
            client:{
                columns:
                    {
                        name:true,
                    }
                },
            domains:
                {columns:
                    {
                        name:true,
                        expirationDate:true,
                    },
                    with:{
                        provider:{
                            columns:{
                                name:true,
                            }
                        }
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