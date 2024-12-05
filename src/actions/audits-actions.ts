"use server"
import db from "@/db";
import { audits } from "@/db/schema";
import { desc , eq} from "drizzle-orm";

export async function getAudits() {
    try{
        const data = await db.query.audits.findMany({
          orderBy: [desc(audits.id)],
          with:{
            user:{
              columns:{
                name:true
              }
            }
          }
        });
        return data;
    }
    catch(error){
        console.error("Error al obtener proveedores:", error);
        throw error;
    }
};
export async function getAudit(id:number) {
  try{
      const aud = await db.query.audits.findFirst({
        where: eq(audits.id, id),
        with:{
          audit_details:true,
          user:{
            columns:{
              name:true,
            }
          },
        }
      });
      return aud;
  }
  catch(error){
      console.error("Error al obtener el proveedor:", error);
      throw error;
  }
};