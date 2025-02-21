"use server"
import db from "@/db";
import { localities } from "@/db/schema";
import { desc, eq} from "drizzle-orm";

export async function getLocalities() {
  try {
    const data = await db.query.localities.findMany({
      orderBy: [desc(localities.id)],
    });
    return data;
  }
  catch (error) {
    console.error("Error al obtener localidades:", error);
    throw error;
  }
};

export async function getLocality(id: number) {
  try {
    if (!id) {
      throw new Error(`El id no está definido`);
    }
    const locality = await db.query.localities.findFirst({
      where: eq(localities.id, id),
    });
    return locality;
  }
  catch (error) {
    console.error("Error al obtener la localidad:", error);
    throw error;
  }
};