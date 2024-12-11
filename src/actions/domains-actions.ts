"use server"
import db from "@/db";
import { domains } from "@/db/schema";
import { desc , eq, or} from "drizzle-orm";

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
