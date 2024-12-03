"use server"
import db from "@/db";
import { providers } from "@/db/schema";
import {z} from "zod";
const providerSchema = z.object({
    name: z
      .string()
      .max(30, { message: "El nombre debe tener como máximo 30 caracteres" })
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    url: z.string().refine((url) => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(url), {
      message: "URL inválida",
    }),
  });
type Provider = z.infer<typeof providerSchema>;

export async function getProviders() {
    try{
        const data = await db.select().from(providers);
        // console.log(data)
        return data;
    }
    catch(error){
        console.error("Error al obtener proveedores:", error);
        throw error;
    }
};

export async function insertProvider(provider: Provider) {
    try {
      const result = await db.insert(providers).values(provider).returning();
      console.log("Proveedor insertado en la base de datos:", result);
      return result;
    } catch (error) {
      console.error("Error al insertar proveedor:", error);
      throw error;
    }
  };