"use server"
import db from "@/db";
import { contacts } from "@/db/schema";
import { desc , eq} from "drizzle-orm";

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