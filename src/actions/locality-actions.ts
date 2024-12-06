"use server"
import db from "@/db";
import { localities } from "@/db/schema";
import { desc} from "drizzle-orm";

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